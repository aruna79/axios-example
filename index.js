/* Code goes here */
const URL = 'https://petdibs.herokuapp.com/pets';

const reportStatus = (message) => {
  $('#status-message').html(message);
};


const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

const loadPets = () => {
  const petList = $('#pet-list');
  petList.empty();

  reportStatus('Loading Pets! Please Wait..');

  // get the thing
  axios.get(URL)
    .then((response) => {
      response.data.forEach((pet) => {
        petList.append(`<li>${pet.name}</li>`);
      });
      reportStatus('Pets loaded')
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message} `);

    });

console.log('This is after .get');
}
//
// Creating Pets
//
const FORM_FIELDS = ['name', 'age', 'owner'];
const inputField = name => $(`#pet-form input[name="${name}"]`);

const readFormData = () => {
  const getInput = name => {
    const input = inputField(name).val();
    return input ? input : undefined;
  };

  const formData = {};
  FORM_FIELDS.forEach((field) => {
    formData[field] = getInput(field);
  });

  return formData;
};

const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    inputField(field).val('');
  });
}

const createPet = (event) => {
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  let petData = {};
  petData['name'] = $(`input[name="name"]`).val()
  petData['age'] = $(`input[name="age"]`).val()
  petData['owner'] = $(`input[name="name"]`).val()


  const petData = readFormData();
  console.log(petData);

  reportStatus('Sending pet data...');

  axios.post(URL,petData)
    .then((response) => {
      console.log('The post req was succesful')
      reportStatus(`Successfully added a pet with ID ${response.data.id}!`);
      clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
};

//
$(document).ready(() => {
  $('#load').click(loadPets);
  $('#pet-form').submit(createPet);
});
