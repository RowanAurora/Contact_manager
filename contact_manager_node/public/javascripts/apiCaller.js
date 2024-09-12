export class APICaller {
  constructor(eventHandlers) {
    this.eventHandlers = eventHandlers;
  }

  async deleteContact(id) {
    let response = await fetch(`/api/contacts/${id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) {
      alert("Contact Deleted");
    } else {
      alert('Error Deleting');
    }
  }

  async getAllContacts() {
    let contacts = await fetch('/api/contacts');

    if (contacts.status !== 200) alert('error fetching contacts');

    return contacts.json();
  }

  async getSingleContact(id) {
    let contact = await fetch(`/api/contacts/${id}`);
    if (contact.status !== 200) alert('error fetching contacts');
    return contact.json();
  }

  async saveContact(newContact) {
    let contextObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(newContact),
    };

    await fetch('http://localhost:3000/api/contacts/', contextObj)
      .then(response => {
        if (response.status === 201) {
          alert('Contact Added');
        } else {
          alert('error adding contact');
        }
      });
  }

  serializeForm() {
    let formElem = document.querySelector("#contactEditForm");
    let form = new FormData(formElem);
    let obj = {id: Number($('#editId').attr('value'))};
    for (const [key, value] of form) {
      obj[key] = value;
    }
    obj.tags = $('#tagSelect').val().join(',');
    return obj;
  }

  serializeNewForm() {
    let formElem = document.querySelector("#addContactForm");
    let form = new FormData(formElem);
    let obj = {
    };
    for (const [key, value] of form) {
      obj[key] = value;
    }
    obj.tags = $('#tagSelect').val().join(',');
    return obj;
  }

  async updateContact(id, info) {
    let contextObj = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info),
    };

    await fetch(`http://localhost:3000/api/contacts/${id}`, contextObj)
      .then((response) => {
        if (response.status === 201) {
          alert("Contact Updated");
        } else {
          alert('error editing contact');
        }
      });

    $('main').empty();
  }
}