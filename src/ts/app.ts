import { createLogin, handleLogin } from "./login.js";
import { createRegister, handleRegister } from "./register.js";
import { createHeader } from "./header.js";
import { errPage } from "./404.js";

const userId = sessionStorage.getItem('user_id') || null;
const role = sessionStorage.getItem('role') || null;

const root = document.getElementById('root') as HTMLDivElement;


function clearRoot() {
    console.log('CLEARED ROOT');
    
    root.innerHTML = "";
    root.appendChild(createHeader());
}

if (!root) {
    throw new Error('Root element not found');
}

function renderLogin() {
    if (!userId && !role) {
        root.appendChild(createLogin());
    }
}

function renderRegister() {
    if (!userId && !role) {
        root.appendChild(createRegister());
    }
}

function renderErrPage(){
    clearRoot();
    root.innerHTML += errPage();
}

async function logOut(){
    try {

        const result = await fetch('http://localhost/api/logout', {
            method: 'GET'});
        
        const response = await result.json();
        if (result.ok){
            if (response){
                console.log(response);
                sessionStorage.clear();
                navigate('/');
            }
        }

    } catch (err){ 
        console.error(err);
        alert('error happened while logging out');
    }
}

const routes: { [key: string]: () => void } = {
    "/": renderLogin,
    "/login": renderLogin,
    "/register": renderRegister,
    "/logout": logOut
};

function router() {
    const path = window.location.pathname;
    const route = routes[path];
    if (route) {
        clearRoot();
        route();    
    } else {
        renderErrPage();
    }
}

function navigate(path: string) {
    window.history.pushState({}, "", path);
    router();
}

function handleNavigation(event: Event) {
    const target = event.target as HTMLElement;

    if (target.tagName === 'A' && target.hasAttribute('href')) {
        const path = target.getAttribute('href');
        if (path && path.startsWith('/')) {
            event.preventDefault();
            navigate(path);
        }
    }

    if (target.tagName === 'FORM') {
        const form = target as HTMLFormElement;

        if (form.id === 'loginForm') {
            event.preventDefault();
            handleLogin().then(() => navigate('/'));
        }

        if (form.id === 'registerForm') {
            event.preventDefault();
            handleRegister().then(() => navigate('/login'));
        }
    }
}

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
    router();
});

document.addEventListener('click', handleNavigation);
document.addEventListener('submit', handleNavigation);
