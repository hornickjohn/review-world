document.querySelector("#categoryForm").addEventListener("submit",e=>{
    e.preventDefault();
    const categoryObj = {
        name:document.querySelector("#name").value,
    }
    console.log(categoryObj)
    fetch("/api/category",{
        method:"POST",
        body:JSON.stringify(categoryObj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res=>{
        if(res.ok){
           location.href="/category"
        } else {
            alert("submit failed")
        }
    })
})