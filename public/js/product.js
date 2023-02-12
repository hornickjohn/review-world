document.querySelector("#productForm").addEventListener("submit",e=>{
    e.preventDefault();
    const categoryObj = {
        name:document.querySelector("#name").value,
        category_id:document.querySelector("#category").value,
    }
    console.log(categoryObj)
    fetch("/api/product",{
        method:"POST",
        body:JSON.stringify(categoryObj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res=>{
        if(res.ok){
           location.href="/product"
        } else {
            alert("submit failed")
        }
    })
})