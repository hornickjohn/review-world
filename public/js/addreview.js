const form = document.querySelector("#addreviewform");
const categoryInput = document.querySelector("#categories");
const productInput = document.querySelector("#product");
const reviewInput = document.querySelector("#review");
const ratingBoxes = [];

for(let i = 1; i <= 5; i++) {
    ratingBoxes.push(document.querySelector("#star" + i));
}
for(let i = 0; i < ratingBoxes.length; i++) {
    ratingBoxes[i].addEventListener('click',event=>{
        for(let j = 0; j < ratingBoxes.length; j++) {
            ratingBoxes[j].checked = j <= i;
        }
    });
}

form.addEventListener('submit',event=>{
    event.preventDefault();

    let category = categoryInput.value;

    let product = productInput.value.trim();

    let rating = 0;
    for(let i = ratingBoxes.length - 1; i >= 0; i--) {
        if(ratingBoxes[i].checked) {
            rating = i + 1;
            break;
        }
    }
    if(rating === 0) {
        //RATING NOT SELECTED
        return;
    }

    let review = reviewInput.value.trim();
    if(review.length < 1) {
        //REVIEW NOT ENTERED
        return;
    } else if(review.length > 2000) {
        //REVIEW TOO LONG - and/or set textarea to limit to 2000char
        return;
    }

    const reviewObj = {
        reviewText:review,
        rating,
        product,
        category_id:parseInt(category)
    };

    fetch("/api/reviews",{
        method:"POST",
        body:JSON.stringify(reviewObj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res=>{
        if(res.ok){
           location.href="/"
        } else {
            alert("Error.");
        }
    });
});