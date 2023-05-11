let updateStatus = (user) => {
  return fetch(
    "https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/" + user.id
  )
    .then((res) => res.json())
    .then((data) => {
      data.status = true;
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

$(".login form").on("submit", (e) => {
  e.preventDefault();

  let email = $('.login form input[type="email"]').val();
  let password = $('.login form input[type="password"]').val();

  let validation = (data) => {
    let userExist = false;
    $.each(data, function () {
      if (this.email === email) {
        userExist = true;
        $(".log-in-err").css({
          display: "none",
        });
        if (this.password === password) {
          $(".log-in-err").css({
            display: "none",
          });

          localStorage.setItem("user", JSON.stringify(this));
          this.status = true;
          updateStatus(this)
            .then(() => {
              window.location.href = "../html/index.html";
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        } else {
          $(".log-in-err").css({
            display: "flex",
          });

          $(".log-in-err p").text("Invalid password.");
        }
      }
    });
    if (!userExist) {
      $(".log-in-err").css({
        display: "flex",
      });

      $(".log-in-err p").text("Invalid email.");
    }
  };

  fetch("https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users")
    .then((res) => res.json())
    .then((res) => validation(res));
});

class User {
  constructor(email, name, password) {
    this.orders = [];
    this.shoppingCart = [];
    this.name = name;
    this.email = email;
    this.password = password;
    this.status = true;
  }
}

$(".registration").on("submit", (e) => {
  e.preventDefault();

  const name = $("#input3").val();
  const email = $("#input4").val();
  const password = $("#input5").val();
  const verifyPassword = $("#input6").val();

  const handleRegistration = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "../html/index.html";
  };

  fetch("https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users")
    .then((res) => res.json())
    .then((users) => {
      const userExist = users.some((user) => user.email === email);
      if (userExist) {
        $(".reg-in-err").css({
          display: "flex",
        });
        $(".reg-in-err p").text(`User with email ${email} already exists!`);
        return Promise.reject();
      } else if (password !== verifyPassword) {
        $(".reg-in-err").css({
          display: "flex",
        });
        $(".reg-in-err p").text("Password does not match.");
        return Promise.reject();
      } else {
        const newUser = new User(email, name, password);
        return fetch(
          "https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users",
          {
            method: "POST",
            headers: { "content-type": "application/json; charset=utf-8" },
            body: JSON.stringify(newUser),
          }
        )
          .then((response) => response.json())
          .then((user) => {
            handleRegistration(user);
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
