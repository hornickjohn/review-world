document.querySelector("#reviewForm").addEventListener("submit",e=>{
    e.preventDefault();
    // how to select value of the checked radiobutton
    var rating = document.querySelector('input[name="star"]:checked')?.value || 0;
    const product_id = document.querySelector("#product").value;
    if (product_id.length == 0){
        alert("Please select a product.")
        return;
    }
    var reviewText = document.querySelector("#reviewText").value;
    if (reviewText.length == 0){
        alert("Please enter a review.")
        return;
    }
    
    console.log(rating)
    const reviewObj = {
        product_id:product_id,
        rating:rating,
        reviewText:reviewText
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
            location.href="/review?product_id=" + document.querySelector("#product").value
        } else {
            alert("submit failed")
        }
    })
})
document.querySelector("#product").addEventListener("change",e=>{
    e.preventDefault();
    location.href="/review?product_id=" + document.querySelector("#product").value
})