document.querySelector("#reviewForm").addEventListener("submit",e=>{
    e.preventDefault();
    const reviewObj = {
        product_id:document.querySelector("#product").value,
        rating:document.querySelector("#rating").value,
        reviewText:document.querySelector("#reviewText").value
    }
    console.log(reviewObj)
    fetch("/api/review",{
        method:"POST",
        body:JSON.stringify(reviewObj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res=>{
        if(res.ok){
           location.href="/review"
        } else {
            alert("submit failed")
        }
    })
})