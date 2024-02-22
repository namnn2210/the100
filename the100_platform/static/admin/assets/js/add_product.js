var lastLevelCategory = 0;
var editItems = {
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function populateList(categories, childrenClass) {
  // Find the div in the DOM
  const div = document.querySelector("." + childrenClass);
  const number = childrenClass.split("-")[1];
  const new_number = parseInt(number) + 1;
  const newChildren = "children-" + new_number;
  // Create a new 'ul' element
  const ul = document.createElement("ul");
  ul.className = "list-unstyled scrollable-list"; // Add any classes you need for styling

  // Clear existing content in the div
  div.innerHTML = "";

  // Loop through each category and add it to the list
  categories.forEach((category) => {
    console.log(category);
    // Create a new 'li' element
    const li = document.createElement("li");

    // Add category name
    const spanName = document.createElement("span");
    spanName.textContent = category.fields.display_category_name;
    spanName.setAttribute("id", `${category.pk}`);
    spanName.setAttribute('data-can-click', `${category.fields.has_children}`);
    spanName.setAttribute(
      "onclick",
      `chooseCategory(this, ${category.pk}, '${newChildren}', '${category.fields.display_category_name}')`
    );
    li.appendChild(spanName);

    // Check if the category has children and add an indicator
    if (category.fields.has_children) {
      const spanArrow = document.createElement("span");
      spanArrow.innerHTML = ' &rsaquo; ';
      spanArrow.classList.add("category-item-right");
      spanArrow.style = 'font-size: 20px';
      li.appendChild(spanArrow);
    }

    // Append the 'li' element to the 'ul'
    ul.appendChild(li);
  });

  // Append the 'ul' to the div
  div.appendChild(ul);
}

function chooseCategory(ctx, categoryId, children, displayName) {
  // Highlight to item is clicked
  let parentEle = ctx.parentElement.parentElement;
  let listChildrensEle = parentEle.children;
  for (let i = 0; i < listChildrensEle.length; i++) {
    if (listChildrensEle[i].hasAttribute('data-clicked')){
      listChildrensEle[i].removeAttribute('data-clicked');
    }
  }
  ctx.parentElement.setAttribute('data-clicked', true);


  // Check if item is not exist then save item to object
  var currentIndex = children.split('-')[1];
  if (!editItems['lv' + (currentIndex - 1)]){
    editItems['lv' + (currentIndex - 1)] = {};
    editItems['lv' + (currentIndex - 1)].id = categoryId;
    editItems['lv' + (currentIndex - 1)].name = ctx.textContent.trim();
  } else {
    editItems['lv' + (currentIndex - 1)].id = categoryId;
    editItems['lv' + (currentIndex - 1)].name = ctx.textContent.trim();
  }

  // Reset list all items behind current list items (currentIndex)
  // range = 6: user setup, not logic of system
  for (var i = currentIndex; i < 6; i++) {
    if (document.querySelector('.children-' + i)){
      document.querySelector('.children-' + i).innerHTML = '';
      delete editItems['lv' + (i)];
    }
  }

  // ON/OFF save change button
  var isSaveChange = ctx.getAttribute('data-can-click').toLowerCase().toString();
  if (isSaveChange == 'true'){
    document.getElementById('btn-save-change').setAttribute('disabled', true);
  } else {
    document.getElementById('btn-save-change').removeAttribute('disabled');
  }

  // Show list items is choosen to views
  var listItemSelectedStr = '';
  var listKeys = Object.keys(editItems);
  for (let i = 0; i < listKeys.length; i++) {
    listItemSelectedStr += editItems[listKeys[i]].name + (i < listKeys.length - 1 ? ' &rsaquo; ' : '');
  }
  document.getElementById("chosenCategories").innerHTML = "Đã chọn: " + '<span style="font-weight: 600">' + listItemSelectedStr + '</span>';

  let chosenCategories;
  lastLevelCategory = categoryId;
  // console.log("Last level category: ", lastLevelCategory);
  const csrftoken = getCookie("csrftoken");
  // if (children === "children-1") {
  //   chosenCategories = document.getElementById("chosenCategories");
  //   chosenCategories.innerHTML = "";
  //   chosenCategories.innerHTML = displayName;
  // } else {
  //   chosenCategories = document.getElementById("chosenCategories").textContent;
  //   chosenCategories.innerHTML = chosenCategories + " > " + displayName;
  // }
  const dataToSend = {
    categoryId: categoryId,
  };
  fetch("/admin/category/children/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrftoken, // Include CSRF token in headers
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => response.json())
    .then((data) => {
      // 'data' is now the JSON response from Django
      const categories = JSON.parse(data.categories);
      populateList(categories, children);
    });
}


function saveChoosenCategory() {
  const csrftoken = getCookie("csrftoken");
  const dataToSend = {
    categoryId: lastLevelCategory,
  };
  console.clear();


  // Show list items is choosen into input
  var listItemSelectedStr = '';
  var listKeys = Object.keys(editItems);
  for (let i = 0; i < listKeys.length; i++) {
    listItemSelectedStr += editItems[listKeys[i]].name + (i < listKeys.length - 1 ? ' > ' : '');
  }
  document.querySelector("input[id=category]").value =listItemSelectedStr;

  fetch("/shopee/get_attributes/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrftoken, // Include CSRF token in headers
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => response.json())
    .then((data) => {
      // 'data' is now the JSON response from Django
      console.log("Getting attributes...");
      console.log(data.data);
      loadFormAfterSaveCate(data.data.response.attribute_list);
    });

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
  //         console.log(data.data.response)
  //         loadBrands(data.data.response);
  //     })
  //
  //
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
  //         console.log(data.data.response.days_to_ship_limit)
  //         var dayToShipInput = $('#days-to-ship-input');
  //         if (data.data.response.days_to_ship_limit) {
  //             dayToShipInput.attr({
  //                 "max": data.data.response.days_to_ship_limit.max_limit,
  //                 "min": data.data.response.days_to_ship_limit.min_limit
  //             });
  //         }
  //     })
  //
  //
  fetch("/shopee/get_size_chart/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrftoken, // Include CSRF token in headers
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => response.json())
    .then((data) => {
      // 'data' is now the JSON response from Django
      console.log("Getting size chart...");
      console.log(data.data);
    });
  //
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
  //
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
  var detailInfo = document.querySelector("#detail-info-content");
  detailInfo.innerHTML = "";
  document.querySelector("#detail-info").removeAttribute("style");
  const divDetail = document.createElement("div");
  divDetail.setAttribute("class", "row");
  attributeLists.forEach((attribute) => {
    const div = document.createElement("div");
    div.setAttribute("class", "form-group col-md-6 my-2");

    const label = document.createElement("label");
    label.setAttribute("for", attribute.attribute_id);
    label.text = attribute.display_attribute_name;
    label.innerText = attribute.display_attribute_name;
    div.appendChild(label);

    if (attribute.input_type == "COMBO_BOX") {
      const select = document.createElement("select");
      select.setAttribute("id", attribute.attribute_id);
      select.setAttribute("class", "form-control col-md-6");
      attribute.attribute_value_list.forEach((valueList) => {
        const option = document.createElement("option");
        option.value = valueList.value_id;
        option.text = valueList.display_value_name;
        select.appendChild(option);
      });
      div.appendChild(select);
    } else {
      const input = document.createElement("input");
      let type = "";
      input.setAttribute("id", attribute.attribute_id);
      input.setAttribute("class", "form-control");
      if (attribute.input_validation_type == "DATE_TYPE") {
        type = "date";
      } else {
        type = "text";
      }
      input.setAttribute("type", type);
      div.appendChild(input);
    }
    divDetail.appendChild(div);
  });
  detailInfo.appendChild(divDetail);
}

function loadBrands(attribute) {
  var detailInfo = document.querySelector("#detail-info-content");
  const div = document.createElement("div");
  div.setAttribute("class", "form-group col-md-6 my-2");

  const label = document.createElement("label");
  label.setAttribute("for", attribute.attribute_id);
  label.text = "Thương hiệu";
  label.innerText = "Thương hiệu";
  div.appendChild(label);

  // if (attribute.input_type == 'DROP_DOWN') {
  const select = document.createElement("select");
  select.setAttribute("id", attribute.attribute_id);
  select.setAttribute("class", "form-control col-md-6");
  attribute.brand_list.forEach((valueList) => {
    const option = document.createElement("option");
    option.value = valueList.brand_id;
    option.text = valueList.display_brand_name;
    select.appendChild(option);
  });
  div.appendChild(select);
  // } else {
  //     const input = document.createElement('input');
  //     let type = '';
  //     input.setAttribute('id', attribute.attribute_id);
  //     input.setAttribute('class', 'form-control');
  //     if (attribute.input_validation_type == 'DATE_TYPE') {
  //         type = 'date'
  //     } else {
  //         type = 'text'
  //     }
  //     input.setAttribute('type', type);
  //     div.appendChild(input);
  // }

  detailInfo.appendChild(div);
}

function quitModal() {
  const modalForm = document.getElementById("LoginForm");
  const modal = bootstrap.Modal.getInstance(modalForm);
  modal.hide();
}

function ready(cb) {
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", function () {
        cb();
      })
    : cb();
}

ready(function () {
  initEvent();
});

function initData() {}

function initEvent() {}

function f1() {
  let index = parseInt(this.dataset.index);
  document.getElementById("file-img-" + index).click();
}

function f2() {
  let index = parseInt(this.dataset.index);
  let file = this.files[0];
  document.getElementById(`img-preview-${index}`).src =
    URL.createObjectURL(file);
  document.getElementById(`bi-card-image-${index}`).classList.add("d-none");
}

function initEventImg() {
  let previewImg = document.getElementsByClassName("preview-img");
  for (let i = 0; i < previewImg.length; i++) {
    previewImg[i].removeEventListener("change", f1);
    previewImg[i].addEventListener("click", f1);
  }

  let fileImg = document.getElementsByClassName("file-img");
  for (let i = 0; i < fileImg.length; i++) {
    fileImg[i].removeEventListener("change", f2);
    fileImg[i].addEventListener("change", f2);
  }
}

function addClassify(ctx) {
  ctx.classList.add("d-none");

  // Thêm một nhóm phân loại vào trong danh sách
  let index = document.querySelectorAll("#list-classify .classify-item").length;

  // Nhóm phân loại 1
  let html = `
                <div class="classify-item">
                    <div class="d-flex mb-3">
                        <div class="col-2 type-title">Nhóm phân loại 1</div>
                        <div class="classify-item-content">
                            <div class="d-flex align-items-enter wrapper-inp">
                                <div class="col-6 d-flex">
                                    <div class="input-group input-group-sm">
                                        <input
                                            type="text"
                                            id="classify-${index}"
                                            data-index="${index}"
                                            class="form-control"
                                            placeholder="ví dụ: màu sắc v.v"
                                            oninput="changeClassify(this)"
                                        />
                                        <span
                                            class="input-group-text"
                                            id="count-char-${index}"
                                            >0/20</span
                                        >
                                    </div>
                                </div>
                                <span><i class="fa fa-xmark"></i></span>
                            </div>
                            <div id="error-${index}" class="error-message"></div>
                        </div>
                    </div>
                    <div class="d-flex mb-3">
                        <div class="col-2 type-title">Phân loại hàng</div>
                        <div id="list-type-${index}" class="list-type">
                            <div id="type-${index}-0" class="col-6 type wrapper-inp">
                                <div class="d-flex align-items-center">
                                    <div class="input-group input-group-sm">
                                        <input
                                            type="text"
                                            id="classify-type-${index}-0"
                                            class="form-control classify-type"
                                            data-parent-index="${index}"
                                            data-index="0"
                                            placeholder="ví dụ: màu đỏ v.v"
                                            oninput="changeInputType(this)"
                                        />
                                        <span
                                            class="input-group-text"
                                            id="count-char-0-0"
                                            >0/20</span
                                        >
                                    </div>
                                    <button class="btn btn-sm trash" id="trash-${index}-0" style="cursor: not-allowed; opacity: 0.65;">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                                <div id="error-${index}-0" class="error-message"></div>
                            </div>
                        </div>
                    </div>

                    <div class="icon-remove-classify-item" data-index="${index}" onclick="removeClassifyItem(this)">
                        <i class="bi bi-x-lg"></i>
                    </div>
                </div>
                `;

  // Nhóm phân loại 2
  html += `
                <div class="classify-item">
                    <div class="d-flex mb-3">
                        <div class="col-2 type-title">Nhóm phân loại 2</div>
                        <div class="classify-item-content">
                            <div class="d-flex align-items-enter wrapper-inp">
                                <div class="col-6 d-flex">
                                    <div class="input-group input-group-sm wrapper-classify-inp d-none">
                                        <input
                                            type="text"
                                            id="classify-${index + 1}"
                                            data-index="${index + 1}"
                                            class="form-control"
                                            placeholder="ví dụ: size v.v"
                                            oninput="changeClassify(this)"
                                        />
                                        <span
                                            class="input-group-text"
                                            id="count-char-${index + 1}"
                                            >0/20</span
                                        >
                                    </div>
                                    <div id="btn-active-classify" data-index="${
                                      index + 1
                                    }" onclick="activeAddClassify(this)">
                                        <i class="bi bi-plus-lg"></i>
                                        Thêm nhóm phân loại 2
                                    </div>
                                </div>
                                <span><i class="fa fa-xmark"></i></span>
                            </div>
                            <div id="error-${
                              index + 1
                            }" class="error-message"></div>
                        </div>
                    </div>
                    <div class="d-flex mb-3 wrapper-classify-content d-none">
                        <div class="col-2 type-title">Phân loại hàng</div>
                        <div id="list-type-${index + 1}" class="list-type">
                            <div id="type-${
                              index + 1
                            }-0" class="col-6 type wrapper-inp">
                                <div class="d-flex align-items-center">
                                    <div class="input-group input-group-sm">
                                        <input
                                            type="text"
                                            id="classify-type-${index + 1}-0"
                                            class="form-control classify-type"
                                            data-parent-index="${index + 1}"
                                            data-index="0"
                                            placeholder="ví dụ: S, M v.v"
                                            data-active="false"
                                            oninput="changeInputType(this)"
                                        />
                                        <span
                                            class="input-group-text"
                                            id="count-char-1-0"
                                            >0/20</span
                                        >
                                    </div>
                                    <button class="btn btn-sm trash" id="trash-${
                                      index + 1
                                    }-0" style="cursor: not-allowed; opacity: 0.65;">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                                <div id="error-${
                                  index + 1
                                }-0" class="error-message"></div>
                            </div>
                        </div>
                    </div>

                    <div class="icon-remove-classify-item d-none" data-index="${
                      index + 1
                    }" onclick="removeClassifyItem(this)">
                        <i class="bi bi-x-lg"></i>
                    </div>
                </div>
                `;

  document
    .getElementById("list-classify")
    .insertAdjacentHTML("beforeend", html);

  let tbody = `
            <tr id="row-0" data-index="0">
                <td class="column1">
                    <input type="file" id="file-img-0" data-index="0" class="file-img"
                        accept="image/*" hidden>
                    <div class="d-flex align-items-center justify-content-center flex-column">
                        <div id="classify-type-name-0"></div>
                        <div id="preview-img-0" data-index="0" class="preview-img">
                            <img id="img-preview-0" src="" alt="img" width="100%" height="100%" style="object-fit: contain;">
                            <i class="bi bi-card-image" id="bi-card-image-0"></i>
                        </div>
                    </div>
                </td>
                <td class="column3">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">đ</span>
                        <input type="number" id="price-0" class="form-control">
                    </div>
                </td>
                <td class="column4">
                    <input type="number" id="wh-0" class="form-control form-control-sm wh" value="0"
                        min="0">
                </td>
                <td class="column5">
                    <input type="text" id="sku-0" class="form-control form-control-sm sku"
                        placeholder="Nhập vào">
                </td>
            </tr>
            `;

  let thead = `
            <tr>
                <th id="column-0">Nhóm phân loại 1</th>
                <th>Giá</th>
                <th>Kho hàng</th>
                <th>SKU phân loại</th>
            </tr>`;

  document.querySelector("#my-tbl thead").innerHTML = thead;
  document.querySelector("#my-tbl tbody").innerHTML = tbody;
  initEventImg();
}

function changeClassify(ctx) {
  let index = parseInt(ctx.dataset.index);
  let input = ctx.value.trim();

  if (input.length > 20) {
    ctx.value = input.slice(0, 20);
  } else {
    if (input.length == 0) {
      document.getElementById(`error-${index}`).innerHTML =
        "Không được để trống ô";
    } else {
      document.getElementById(`error-${index}`).innerHTML = "";
    }
  }

  document.getElementById(`count-char-${index}`).innerHTML =
    ctx.value.trim().length + "/20";

  // Các thay đổi trên bảng
  if (input.length > 0) {
    document.querySelector(`#column-${index}`).innerHTML = input;
  } else {
    document.querySelector(`#column-${index}`).innerHTML =
      "Nhóm phân loại " + (index + 1);
  }
}

let active2 = false;

function activeAddClassify(ctx) {
  active2 = true;
  ctx.classList.add("d-none");
  let index = parseInt(ctx.dataset.index);
  document.querySelector(".wrapper-classify-inp").classList.remove("d-none");
  document
    .querySelector(".wrapper-classify-content")
    .classList.remove("d-none");

  document
    .querySelectorAll(".icon-remove-classify-item")[1]
    .classList.remove("d-none");

  // Các thay đổi trong bảng
  let th = `<th id="column-${index}">Nhóm phân loại 2</th>`;
  document
    .querySelector(`#my-tbl thead #column-0`)
    .insertAdjacentHTML("afterend", th);

  let cell = `
            <td class="column2">
                <div style="width: 100%; min-height: 30px;">
                    <div class="child-list" style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; width: 100%;min-height: 100%;"></div>
                </div>
            </td>
            `;
  let tr = document.querySelectorAll("#my-tbl tbody tr");
  for (let i = 0; i < tr.length; i++) {
    tr[i].querySelector("td.column1").insertAdjacentHTML("afterend", cell);
  }
}

function changeInputType(ctx) {
  let parentIndex = parseInt(ctx.dataset.parentIndex);
  let index = parseInt(ctx.dataset.index);
  let input = ctx.value.trim();

  ctx.setAttribute("data-active", true);

  document
    .getElementById(`trash-${parentIndex}-${index}`)
    .removeAttribute("hidden");

  if (input.length > 20) {
    ctx.value = input.slice(0, 20);
  } else {
    if (input.length == 0) {
      document.getElementById(`error-${parentIndex}-${index}`).innerHTML =
        "Không được để trống ô";

      if (parentIndex == 0) {
        document.querySelector(`#classify-type-name-${index}`).innerHTML = "";
      }
      if (parentIndex == 1) {
        ctx.setAttribute("data-active", false);
        fillList(parentIndex);
      }
    } else {
      document.getElementById(`error-${parentIndex}-${index}`).innerHTML = "";

      if (
        parentIndex == 0 &&
        !document.querySelector(`#my-tbl tbody #row-${index}`)
      ) {
        let tbody = `
                        <tr id="row-${index}" data-index="${index}">
                            <td class="column1">
                                <input type="file" id="file-img-${index}" data-index="${index}" class="file-img"
                                    accept="image/*" hidden>
                                <div class="d-flex align-items-center justify-content-center flex-column">
                                    <div id="classify-type-name-${index}">n/a</div>
                                    <div id="preview-img-${index}" data-index="${index}" class="preview-img">
                                        <img id="img-preview-${index}" src="" alt="img" width="100%" height="100%" style="object-fit: contain;">
                                        <i class="bi bi-card-image" id="bi-card-image-${index}"></i>
                                    </div>
                                </div>
                            </td>
                            <td class="column3">
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text">đ</span>
                                    <input type="number" id="price-${index}" class="form-control">
                                </div>
                            </td>
                            <td class="column4">
                                <input type="number" id="wh-${index}" class="form-control form-control-sm wh" value="0"
                                    min="0">
                            </td>
                            <td class="column5">
                                <input type="text" id="sku-${index}" class="form-control form-control-sm sku"
                                    placeholder="Nhập vào">
                            </td>
                        </tr>
                        `;
        document
          .querySelector("#my-tbl tbody")
          .insertAdjacentHTML("beforeend", tbody);
        initEventImg();
        if (active2) {
          let cell = `
                            <td class="column2">
                                <div style="width: 100%; min-height: 30px;">
                                    <div class="child-list" style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; width: 100%;min-height: 100%;"></div>
                                </div>
                            </td>
                            `;
          document
            .querySelector(`#row-${index} td.column1`)
            .insertAdjacentHTML("afterend", cell);
          fillList(parentIndex);
        }
      } else {
        let classifyName = document
          .querySelector(`#classify-type-${parentIndex}-${index}`)
          .value.trim();
        parentIndex == 0
          ? (document.querySelector(`#classify-type-name-${index}`).innerHTML =
              classifyName)
          : "";
      }

      if (parentIndex == 1) {
        fillList(parentIndex);
      }
    }
  }

  document.getElementById(`count-char-${parentIndex}-${index}`).innerHTML =
    ctx.value.trim().length + "/20";

  let isExist = document.querySelector(
    `#type-${parentIndex}-${index}`
  ).nextElementSibling;

  if (!isExist) {
    let html = `
                    <div id="type-${parentIndex}-${
      index + 1
    }" class="col-6 type wrapper-inp">
                        <div class="d-flex align-items-center">
                            <div class="input-group input-group-sm">
                                <input
                                    type="text"
                                    id="classify-type-${parentIndex}-${
      index + 1
    }"
                                    class="form-control classify-type"
                                    data-parent-index="${parentIndex}"
                                    data-index="${index + 1}"
                                    placeholder="ví dụ: ${
                                      parentIndex == 0 ? "màu đỏ, vàng" : "S, M"
                                    } v.v"
                                    oninput="changeInputType(this)"
                                />
                                <span
                                    class="input-group-text"
                                    id="count-char-${parentIndex}-${index + 1}"
                                    >0/20</span
                                >
                            </div>
                            <button class="btn btn-sm trash" id="trash-${parentIndex}-${
      index + 1
    }" hidden onclick="removeType(this, ${parentIndex},${index})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                        <div id="error-${parentIndex}-${
      index + 1
    }" class="error-message"></div>
                    </div>
                    `;

    document
      .getElementById("list-type-" + parentIndex)
      .insertAdjacentHTML("beforeend", html);
  }
}

function fillList(parentIndex) {
  let column2 = document.querySelectorAll("td.column2");

  let listInputActive = document.querySelectorAll(
    "#list-type-" + parentIndex + ' input[data-active="true"]'
  );
  let listItem = ``;
  for (let i = 0; i < listInputActive.length; i++) {
    listItem += `<div>${listInputActive[i].value.trim()}</div>`;
  }

  for (let i = 0; i < column2.length; i++) {
    column2[i].querySelector("div.child-list").innerHTML = listItem;
  }
}

function removeType(ctx, parentIndex, index) {
  ctx.parentElement.parentElement.remove();
  if (parentIndex == 0) {
    document.querySelector("#row-" + index).remove();
  }
  fillList(parentIndex);
}

function removeClassifyItem(ctx) {
  let index = parseInt(ctx.dataset.index);

  // Kiểm tra danh sách xem còn loại nào không
  if (document.querySelectorAll("#list-classify .classify-item").length == 0) {
    document.querySelector("#btn-add-classify").classList.remove("d-none");
  }

  if (index === 0) {
    let listClassifyItems = document.querySelectorAll(
      "#list-classify .classify-item"
    );
    for (let i = 0; i < listClassifyItems.length; i++) {
      listClassifyItems[i].remove();
    }
    document.querySelector("#btn-add-classify").classList.remove("d-none");
    document.querySelector("#my-tbl thead").innerHTML = "";
    document.querySelector("#my-tbl tbody").innerHTML = "";
  } else {
    ctx.classList.add("d-none");

    active2 = false;

    // Xoá tất cả cột thứ 2 trong bảng
    document.querySelector("#column-1").remove();
    let column2 = document.querySelectorAll(".column2");
    for (let i = 0; i < column2.length; i++) {
      column2[i].remove();
    }

    let listTypes = document.querySelectorAll(`#list-type-${index} .type`);
    for (let i = 0; i < listTypes.length; i++) {
      if (i === 0) {
        document.querySelector(`#classify-${index}`).value = "";
        document.querySelector(`#count-char-${index}`).innerHTML = "0/20";

        listTypes[i].querySelector(`#classify-type-${index}-0`).value = "";
        document.querySelector(`#count-char-${index}-0`).innerHTML = "0/20";

        document.querySelector(".wrapper-classify-inp").classList.add("d-none");
        document
          .querySelector(".wrapper-classify-content")
          .classList.add("d-none");
      } else {
        listTypes[i].remove();
      }
    }
    document.querySelector("#btn-active-classify").classList.remove("d-none");
    document
      .querySelector("#list-classify .classify-item .wrapper-classify-inp")
      .classList.add("d-none");
  }
}
