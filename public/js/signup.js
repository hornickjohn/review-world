let tkn = '';
document.querySelector("#signUpForm").addEventListener("submit",e=>{
    e.preventDefault();
    const signupObj = {
        first_name:document.querySelector("#firstName").value.trim(),
        last_name:document.querySelector("#lastName").value.trim(),
        email:document.querySelector("#signUpEmail").value.trim(),
        password:document.querySelector("#signUpPw").value.trim(),
        username:document.querySelector("#signupUsername").value.trim(),
        showname:document.querySelector("#showName").checked
    };
    if(signupObj.first_name === "") {
        signupObj.showname = false;
    }
    console.log(signupObj);

    signupObj.token = tkn;

    fetch("/api/users",{
        method:"POST",
        body:JSON.stringify(signupObj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res=>{
        if(res.ok){
           location.href="/profile";
        } else {
            alert("signup failed");
        }
    });
});

function captchaCallback(token) {
    tkn = token;
}