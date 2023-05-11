let user = JSON.parse(localStorage.getItem("user"));

fetch(
  `https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/${user.id}`
)
  .then((res) => res.json())
  .then((res) => $("#product-count p").text(res.shoppingCart.length));

let updateProductCount = () => {
  fetch(
    `https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/${user.id}`
  )
    .then((res) => res.json())
    .then((res) => $("#product-count p").text(res.shoppingCart.length));
};

let updateStatus = (user) => {
  fetch(
    "https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/" + user.id
  )
    .then((res) => res.json())
    .then((data) => {
      data.status = false;
      return fetch(
        "https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/" +
          data.id,
        {
          method: "PUT",
          headers: { "content-type": "application/json; charset=utf-8" },
          body: JSON.stringify(data),
        }
      );
    });
};

if (user) {
  $("#logout-p").css({
    display: "block",
  });

  $("#logout-p").on("click", async () => {
    await updateStatus(user);
    localStorage.removeItem("user");
    window.location.href = "../html/index.html";
  });
}

$("#cabinet").text(user.name);
$("#cabinet").attr("href", "../html/index.html");

let renderOrders = (data) => {
  $.each(data, function () {
    let productRow = $("<div>").addClass("row product");
    let td1 = $("<div>").addClass("td1 pr-info");
    let img = $("<img>")
      .attr("src", `../img/images/products/${this.img}.png`)
      .attr("width", "127");
    let prodName = $("<p>").addClass("prod-name").text(this.title);
    td1.append(img, prodName);
    let td2 = $("<div>").addClass("td2 pr-info");
    const priceValue =
      this.price - (this.price * parseFloat(this.salePercent)) / 100;
    let td3 = $("<div>").addClass("td3 pr-info");

    let td4 = $("<div>").addClass("td4 pr-info");
    let count = $("<p>").text(this.count);
    td4.append(count);
    let td5 = $("<div>").addClass("td5 pr-info");

    if (this.sale) {
      let sale = $("<p>")
        .addClass("sale")
        .text("-" + this.salePercent + "%");
      let price = $("<p>")
        .addClass("price")
        .text("$" + priceValue);
      let newTotal =
        parseInt(price.text().replace("$", "")) * parseInt(count.text());
      let total = $("<p>")
        .addClass("total")
        .text("$" + newTotal);

      td2.append(price);
      td3.append(sale);
      td5.append(total);
    } else {
      let noSale = $("<p>").text("-");
      let price = $("<p>")
        .addClass("price")
        .text("$" + this.price);
      let newTotal =
        parseInt(price.text().replace("$", "")) * parseInt(count.text());
      let total = $("<p>")
        .addClass("total")
        .text("$" + newTotal);

      td2.append(price);
      td3.append(noSale);
      td5.append(total);
    }

    productRow.append(td1, td2, td3, td4, td5);

    $(".table").append(productRow);
  });
};

$(".name").text(user.name);
$(".email").text(user.email);

$('button[type="submit"]').on("click", async (e) => {
  e.preventDefault();

  await fetch(
    `https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/${user.id}`,
    {
      method: "DELETE",
    }
  );

  await localStorage.removeItem("user");

  window.location.href = "../html/index.html";
});

renderOrders(user.orders);
