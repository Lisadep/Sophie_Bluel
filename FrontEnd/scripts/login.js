let user = {
    email: "sophie.bluel@test.tld",
    password: "S0phie"
};

const email = document.getElementById("email");
const password = document.getElementById("password");


function login() {
    fetch(root + 'users/login' , {method : 'POST',
    headers : {"Content-Type": "application/json"},
    body: JSON.stringify(user)}).then(response => response.json().then((responseToken) => {
        console.log(responseToken);
        sessionStorage.setItem('token', responseToken.token)
    }));
}

//Recuperer le token pour le passer au Web service
function getToken(){
    return sessionStorage.getItem('token');
}


login();