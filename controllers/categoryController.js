const router = require('express').Router();
const { Category, Product, } = require('../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  Category.findAll().then(data=> {
    res.json(data)
  }).catch(err=>{
    console.log(err)
    res.status(500).json({
      msg:"an error ocurred",
      err:err
    })
  })
  // find all categories
  // be sure to include its associated Products
}); 

router.get('/:id', (req, res) => {
 Category.findByPk(req.params.id,{
    include: [Product]
  }) .then((data) => {
    res.status(200).json(data);
  })
  .catch(err => handleError(res, err))
});

// create a new category
router.post('/', (req, res) => {
  Category.create(req.body)
  .then((data) => {
    return res.status(200).json(data);
  })
  .catch(err => handleError(res, err))
});

  

router.put('/:id', (req, res) => {
  Category.update({
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
  Category.findByPk(req.params.id).then(foundCategory => {
    if(!foundCategory){
      res.status(400).json({msg: "no such Category"});
    } else {
      Category.destroy({
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