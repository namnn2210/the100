function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

document.getElementById('shop-auth-btn').onclick = function(event) {
        event.preventDefault();
        const csrftoken = getCookie('csrftoken');
//        var shopId = document.getElementById('shopId').value;
//        console.log(shopId)
//        var dataToSend = {
//            'shopId': shopId
//        };
        fetch("/shopee/shop_auth/", {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken // Include CSRF token in headers
            },
//            body: JSON.stringify(dataToSend),
        })
        .then(response => response.json())
        .then(data => {
            window.open(data.url, "popupWindow");
        });
    };