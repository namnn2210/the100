var lastLevelCategory = 0

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
function populateList(categories, childrenClass) {
    // Find the div in the DOM
    const div = document.querySelector('.' + childrenClass);
    var number = childrenClass.split('-')[1]
    var new_number = parseInt(number) + 1
    var newChildren = 'children-'+new_number
    // Create a new 'ul' element
    const ul = document.createElement('ul');
    ul.className = 'list-unstyled scrollable-list'; // Add any classes you need for styling

    // Clear existing content in the div
    div.innerHTML = '';

    // Loop through each category and add it to the list
    categories.forEach(category => {
        // Create a new 'li' element
        const li = document.createElement('li');

        // Add category name
        const spanName = document.createElement('span');
        spanName.textContent = category.fields.display_category_name;
        spanName.setAttribute('id', `${category.pk}`)
        spanName.setAttribute('onclick', `chooseCategory(${category.pk}, '${newChildren}', '${category.fields.display_category_name}')`);
        li.appendChild(spanName);

        // Check if the category has children and add an indicator
        if (category.fields.has_children) {
            const spanArrow = document.createElement('span');
            spanArrow.textContent = ' > ';
            spanArrow.classList.add('category-item-right');
            li.appendChild(spanArrow);
        }

        // Append the 'li' element to the 'ul'
        ul.appendChild(li);
    });

    // Append the 'ul' to the div
    div.appendChild(ul);
}


function chooseCategory(categoryId, children, displayName) {
    lastLevelCategory = categoryId
    console.log('Last level category: ', lastLevelCategory)
    const csrftoken = getCookie('csrftoken');
    if (children == 'children-1') {
        var chosenCategories = document.getElementById('chosenCategories')
        chosenCategories.innerHTML = ''
        chosenCategories.innerHTML = displayName
    }
    else {
        var chosenCategories = document.getElementById('chosenCategories').textContent
        const newChosenCategories = chosenCategories + ' > ' + displayName
        chosenCategories.innerHTML = newChosenCategories
    }
    var dataToSend = {
        categoryId:categoryId
    }
    fetch("/admin/category/children/", {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken // Include CSRF token in headers
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => response.json())
        .then(data => {
            // 'data' is now the JSON response from Django
            const categories = JSON.parse(data.categories);
            populateList(categories,children);
        })
}

function saveChoosenCategory() {
    console.log('Submit category: ', lastLevelCategory)
    const csrftoken = getCookie('csrftoken');
    var dataToSend = {
        categoryId:lastLevelCategory
    }
    fetch("/shopee/get_attributes/", {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken // Include CSRF token in headers
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => response.json())
        .then(data => {
            // 'data' is now the JSON response from Django
            console.log(data.data)
        })
}

function quitModal() {
    const modalForm = document.getElementById('LoginForm')
    var modal = bootstrap.Modal.getInstance(modalForm)
    modal.hide()
}