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
    const number = childrenClass.split('-')[1];
    const new_number = parseInt(number) + 1;
    const newChildren = 'children-' + new_number;
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
    let chosenCategories;
    lastLevelCategory = categoryId
    console.log('Last level category: ', lastLevelCategory)
    const csrftoken = getCookie('csrftoken');
    if (children === 'children-1') {
        chosenCategories = document.getElementById('chosenCategories');
        chosenCategories.innerHTML = ''
        chosenCategories.innerHTML = displayName
    } else {
        chosenCategories = document.getElementById('chosenCategories').textContent;
        chosenCategories.innerHTML = chosenCategories + ' > ' + displayName
    }
    const dataToSend = {
        categoryId: categoryId
    };
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
            populateList(categories, children);
        })
}

function saveChoosenCategory() {
    const csrftoken = getCookie('csrftoken');
    const dataToSend = {
        categoryId: lastLevelCategory
    };
    console.clear();

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
            console.log('Getting attributes...')
            loadFormAfterSaveCate(data.data.response.attribute_list);
        })


    // fetch("/shopee/get_brands/", {
    //     method: 'POST',
    //     headers: {
    //         "X-CSRFToken": csrftoken // Include CSRF token in headers
    //     },
    //     body: JSON.stringify(dataToSend),
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         // 'data' is now the JSON response from Django
    //         console.log('Getting brands...')
    //         console.log(data.data)
    //     })


    // fetch("/shopee/get_dts_limit/", {
    //     method: 'POST',
    //     headers: {
    //         "X-CSRFToken": csrftoken // Include CSRF token in headers
    //     },
    //     body: JSON.stringify(dataToSend),
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         // 'data' is now the JSON response from Django
    //         console.log('Getting day to ship...')
    //         console.log(data.data)
    //     })


    // fetch("/shopee/get_size_chart/", {
    //     method: 'POST',
    //     headers: {
    //         "X-CSRFToken": csrftoken // Include CSRF token in headers
    //     },
    //     body: JSON.stringify(dataToSend),
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         // 'data' is now the JSON response from Django
    //         console.log('Getting size chart...')
    //         console.log(data.data)
    //     })

    // fetch("/shopee/get_item_limit/", {
    //     method: 'POST',
    //     headers: {
    //         "X-CSRFToken": csrftoken // Include CSRF token in headers
    //     },
    //     body: JSON.stringify(dataToSend),
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         // 'data' is now the JSON response from Django
    //         console.log('Getting item limit...')
    //         console.log(data.data)
    //     })

    // fetch("/shopee/get_channel_list/", {
    //     method: 'POST',
    //     headers: {
    //         "X-CSRFToken": csrftoken // Include CSRF token in headers
    //     },
    //     body: JSON.stringify(dataToSend),
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         // 'data' is now the JSON response from Django
    //         console.log('Getting channel list...')
    //         console.log(data.data)
    //     })


    quitModal();
}

function loadFormAfterSaveCate(attributeLists) {
    var detailInfo = document.querySelector('#detail-info-content');
    detailInfo.innerHTML = '';
    document.querySelector('#detail-info').removeAttribute('style');
    const divDetail = document.createElement('div');
    attributeLists.forEach(attribute => {
        const div = document.createElement('div');
        div.setAttribute('class', 'form-group');

        const label = document.createElement('label');
        label.setAttribute('for', attribute.attribute_id);
        label.text = attribute.display_attribute_name;
        label.innerText = attribute.display_attribute_name;
        div.appendChild(label);

        if (attribute.input_type == 'COMBO_BOX') {
            const select = document.createElement('select');
            select.setAttribute('id', attribute.attribute_id);
            select.setAttribute('class', 'form-control');
            attribute.attribute_value_list.forEach(valueList => {
                const option = document.createElement('option');
                option.value = valueList.value_id;
                option.text = valueList.display_value_name;
                select.appendChild(option)
            });
            div.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.setAttribute('id', attribute.attribute_id);
            input.setAttribute('class', 'form-control');
            div.appendChild(input);
        }
        divDetail.appendChild(div);
    });
    detailInfo.appendChild(divDetail);
}

function quitModal() {
    const modalForm = document.getElementById('LoginForm')
    const modal = bootstrap.Modal.getInstance(modalForm);
    modal.hide()
}