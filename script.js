"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const moves = sort
    ? movements.slice().sort(function (a, b) {
        return a - b;
      })
    : movements;

  moves.forEach(function (item, index) {
    const temp = item > 0 ? "deposit" : "withdrawal";
    const html = `
                    <div class="movements__row">
                      <div class="movements__type movements__type--${temp}">${
      index + 1
    } ${temp}</div>
                      <div class="movements__value">₹${item}</div>
                    </div>
                    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovement(account1.movements);

const createUserName = function (acc) {
  acc.forEach(function (act) {
    act.username = act.owner
      .toLowerCase()
      .split(" ")
      .map(function (mov) {
        return mov[0];
      })
      .join("");
  });
};
createUserName(accounts);
// console.log(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov, index) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `₹${acc.balance}`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (mm) {
  const deposit = mm.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  // console.log(deposit);
  labelSumIn.textContent = `₹${deposit}`;

  const withdrawals = mm.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  // console.log(withdrawals);
  labelSumOut.textContent = `₹${Math.abs(withdrawals)}`;

  const interest = mm.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (mov) {
      return (mov * mm.interestRate) / 100;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    });
  // labelSumInterest.textContent = `₹${parseFloat(interest.toFixed(2))}`;
  labelSumInterest.textContent = `₹${interest}`;
};
// calcDisplaySummary(account1.movements);

const updateUI = function (acc) {
  // Display movements
  displayMovement(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(function (mov) {
    return mov.username === inputLoginUsername.value;
  });
  // console.log(currentAccount);

  // Here we use optional chaining (?) to check whether account exist or not
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

// let transferAccount;
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  let transferAccount = accounts.find(function (mov) {
    return mov.username === inputTransferTo.value;
  });
  // console.log(transferAccount,amount);
  console.log(transferAccount.movements);
  console.log(currentAccount);
  if (
    amount > 0 &&
    transferAccount &&
    currentAccount.balance >= amount &&
    transferAccount.username != currentAccount.username
  ) {
    // console.log('Valid');
    currentAccount.movements.push(-amount);
    transferAccount.movements.push(amount);
    // console.log(transferAccount.movements);

    updateUI(currentAccount);
    // Display movements
    // displayMovement(currentAccount.movements);

    // Display Balance
    // calcDisplayBalance(currentAccount.movements);

    // Display Summary
    // calcDisplaySummary(currentAccount);
  }
  inputTransferAmount.value = "";
  inputTransferTo.value = "";
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(function (mov) {
      return mov.username === currentAccount.username;
    });
    // console.log(index);
    accounts.splice(index, 1);
    // console.log(accounts);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});
