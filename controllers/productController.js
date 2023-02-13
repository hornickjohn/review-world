const router = require('express').Router();
const { Category, Product, Review } = require('../models');

// The `/api/products` endpoint

router.get('/', (req, res) => {
  Product.findAll().then(data=> {
    res.json(data)
  }).catch(err=>{
    console.log(err)
    res.status(500).json({
      msg:"an error ocurred",
      err:err
    })
  })
  // find all products
  // be sure to include its associated Products
}); 

router.get('/:id', (req, res) => {
 Product.findByPk(req.params.id,{
    include: [Category,Review]
  }) .then((data) => {
    res.status(200).json(data);
  })
  .catch(err => handleError(res, err))
});

// create a new product
router.post('/', (req, res) => {
  Product.create(req.body)
  .then((data) => {
    return res.status(200).json(data);
  })
  .catch(err => handleError(res, err))
});

  

router.put('/:id', (req, res) => {
  Product.update({
    name:req.body.name,
  },{
    where:{
        id:req.params.id
    }
  }).then(data=>{
    res.json(data)
  })
  .catch(err => handleError(res, err))
  // update a tag's name by its `id` value
});



router.delete('/:id', (req, res) => {
  Product.findByPk(req.params.id).then(foundProduct => {
    if(!foundProduct){
      res.status(404).json({msg: "no such Product"});
    } else {
      Product.destroy({
        where:{
            id:req.params.id
        }
      }).then(data=>{
          res.json(data);
      })
      .catch(err => handleError(res, err))
    }
  })
});


function handleError(res, err) {
  console.log(err)
  res.status(500).json({
    msg:"an error ocurred",
    err:err
  })
}


module.exports = router;