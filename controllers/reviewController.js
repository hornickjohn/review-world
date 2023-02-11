const router = require('express').Router();
const{ User, Category, Review} = require ('../models');

router.get('/', (req, res) =>{
    Review.findAll().then(data =>{
        res.json(data)
    }).catch(err=>{
        console.log(err)
    })
});

router.get('/review', (req, res)=>{
    User.findByPk(req.params.review,{
        include:[Category]
    }).then((data)=>{
        res.status(200).json(data)
    }).catch(err=>{
        console.log(err)
    })
});

router.post('/',(req,res)=>{
    Review.create(req.body).then((data)=>{
        return res.status(200).json(data);
    }).catch(err=>{
        console.log(err)
    })
});

router.put('/review',(req,res)=>{
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

router.delete('/review', (req,res)=>{
    Review.destroy({
        where: {
            review:req.params.review
        }
    }).then((data)=>{
        res.status(200).json(data)
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router;
