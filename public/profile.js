document.querySelector("#new-chirp-form").addEventListener("submit",e=>{
    e.preventDefault();
    const chripObj = {
        chirp:document.querySelector("#chirp-input").value
    }
    console.log(chripObj)
    fetch("/api/chirps",{
        method:"POST",
        body:JSON.stringify(chripObj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res=>{
        if(res.ok){
           location.reload()
        } else {
            alert("signup failed")
        }
    })
})