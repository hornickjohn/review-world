const router = require('express').Router();
const{ User, Category, Review, Product } = require ('../models');

router.get('/', (req, res) =>{
    Review.findAll({
        include:[User,Product],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data =>{
        res.json(data)
    }).catch(err=>{
        console.log(err)
    })
});

router.get('/:review', (req, res)=>{
    User.findByPk(req.params.review,{
        include:[User,Product]
    }).then((data)=>{
        res.status(200).json(data)
    }).catch(err=>{
        console.log(err)
    })
});

router.post('/',async (req,res)=>{
    if(req.session.userId) {
        // const reviewObj = {
        //     reviewText,
        //     rating,
        //     product,
        //      category_id
        // };
        let userId = req.session.userId;
        let createData = {
            reviewText:req.body.reviewText,
            rating:req.body.rating,
            user_id:userId
        };
        await Product.findAll({
            where:{
                category_id:req.body.category_id
            }
        })
        .then(async products => {
            const jsonProducts = products.map(prod=>prod.toJSON());
            let foundID = -1;
            for(let i = 0; i < products.length; i++) {
                if(jsonProducts[i].name.toLowerCase() === req.body.product.toLowerCase()) {
                    foundID = jsonProducts[i].id;
                    break;
                }
            }
            if(foundID === -1) {
                await Product.create({
                    name:req.body.product,
                    category_id:req.body.category_id
                }).then(data=>{
                    foundID = data.id;
                });
            }
            createData.product_id = foundID;
        });
        
        Review.create(createData).then((data)=>{
            return res.status(201).json(data);
        }).catch(err=>{
            console.log(err);
        });
    } else {
        res.status(403).send("Not logged in.");
    }
});

router.put('/:review',(req,res)=>{
    Review.update({
        review_text:req.body.review_text
    },{
        where: {
            review:req.params.review
        }
    }).then((data)=>{
        res.status(200).json(data)
    }).catch(err=>{
        console.log(err)
    })
})

router.delete('/:review', (req,res)=>{
    Review.destroy({
        where: {
            id:req.params.review
        }
    }).then((data)=>{
        res.status(200).json(data)
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router;
