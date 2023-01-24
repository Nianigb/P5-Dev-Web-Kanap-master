
let urlParams = new URLSearchParams(window.location.search);
let orderId = urlParams.get('orderId');

document.getElementById('orderId').innerHTML = orderId;