document.querySelector("#update-profile").addEventListener('submit',event=>{
    event.preventDefault();

    let updateObj = {
        username:document.querySelector('#username').value.trim(),
        email:document.querySelector('#email').value.trim(),
        first_name:document.querySelector('#first_name').value.trim(),
        last_name:document.querySelector('#last_name').value.trim(),
        newpass:document.querySelector('#newpass').value,
        confirmpass:document.querySelector('#confirmpass').value,
        showname:document.querySelector('#showname').checked,
        currentpass:document.querySelector('#currentpass').value
    };
    if(updateObj.newpass.trim() !== "" && updateObj.newpass !== updateObj.confirmpass) {
        alert('New passwords do not match.');
        return;
    }

    fetch("/api/users",{
        method:"PUT",
        body:JSON.stringify(updateObj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res=>{
        if(res.ok){
           location.href="/profile";
        } else {
            console.log(res);
            alert("Sign up failed.");
        }
    });
});