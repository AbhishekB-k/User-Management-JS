fetch("https://randomuser.me/api/?results=10")
  .then((res) => res.json())
  .then((data) => {
    createUI(data.results);
  })
  .catch((err) => {
    console.log("Error Occurred\n", err);
  });

const main = document.getElementById("root");

function createUI(users) {
  
  main.innerHTML = '';

  users.forEach(user => {
    const newCard = document.createElement("div");
    newCard.classList.add("card");

    newCard.innerHTML = `
            <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}">
            <h2>${user.name.first} ${user.name.last}</h2>
            <p>Email: ${user.email}</p>
            <p>Location: ${user.location.city}, ${user.location.country}</p>
            <button onclick="removeItem(this)">Remove</button>
        `;

    main.appendChild(newCard);
  });
}


function searchMyUsers() {
  const searchText = document.getElementById('searchInput').value.trim().toLowerCase(); 

  if (searchText === "") {
    
    fetch("https://randomuser.me/api/?results=10")
      .then((res) => res.json())
      .then((data) => {
        createUI(data.results);
      })
      .catch((err) => {
        console.log("Error Occurred\n", err);
      });
  } else {
    
    fetch("https://randomuser.me/api/?results=10")
      .then((res) => res.json())
      .then((data) => {
        const fetchedUsers = data.results;
        const tempUsers = getTempUsers();

        
        const allUsers = [...fetchedUsers, ...tempUsers];
        
        const filteredUsers = allUsers.filter(user =>
          user.name.first.toLowerCase().includes(searchText) ||
          user.name.last.toLowerCase().includes(searchText)
        );
        createUI(filteredUsers);
      })
      .catch((err) => {
        console.log("Error Occurred\n", err);
      });
  }
}


const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", searchMyUsers);


function removeItem(button) {
    const card = button.parentElement;
    const name = card.querySelector('h2').textContent.split(' ');
    const firstName = name[0];
    const lastName = name[1];
    
    let users = getTempUsers();
    users = users.filter(user => user.name.first !== firstName || user.name.last !== lastName);
    localStorage.setItem('tempUsers', JSON.stringify(users));

    card.remove();
}


function addUser(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;

    const newUser = {
        name: { first: firstName, last: lastName },
        email: email,
        location: { city: city, country: country },
        picture: { large: 'https://via.placeholder.com/100' }
    };

    
    let users = getTempUsers();
    users.push(newUser);
    localStorage.setItem('tempUsers', JSON.stringify(users));

    searchMyUsers(); 

    document.getElementById('add-user-form').reset();
}

document.getElementById('add-user-form').addEventListener('submit', addUser);


function getTempUsers() {
  const users = localStorage.getItem('tempUsers');
  return users ? JSON.parse(users) : [];
}
