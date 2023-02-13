const router = require('express').Router();
const{ User, Category, Review} = require ('../models');

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

router.post('/',(req,res)=>{
    if(req.session.userId) {
        //let createData
        //form it based on req.body AND session user
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
