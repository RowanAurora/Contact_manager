export class EventHandlers {

  constructor(apiCaller, display, inputValidation) {
    this.apiCaller = apiCaller;
    this.displayer = display;
    this.inputValidation = inputValidation;
    this.timer = null;
  }

  areYouSureButtonHandlers() {
    $('body').on('click', "#noSure", (event) => {
      event.preventDefault();
      $('#areYouSure').hide();
    });

    $('body').on('click', "#yesSure", (event) => {
      this.apiCaller.deleteContact(event.target.value);
      $('#areYouSure').hide();
      this.refresh();
    });
  }

  addTagSubmitHandler() {
    $("main").on('click', '#submitTag', () => {
      if (this.inputValidation.validateTag($('#tag').val())) {
        this.displayer.addedTags.push($('#tag').val());
        this.displayer.populateContacts();
      } else {
        alert('Only alphabetic Characters in tags');
        this.displayer.incorrect("#tag");
      }
    });
  }

  bindHandlers() {
    this.addContactSubmit();
    this.addTagSubmitHandler();
    this.areYouSureButtonHandlers();
    this.cancelButtons();
    this.deleteContactHandler();
    this.displayAddContactHandler();
    this.displayEditHandler();
    this.displayAddTagHandler();
    this.searchHandler();
    this.submitEditHandler();
    this.tagSearchHandler();
  }

  addContactSubmit() {
    $('main').on('submit', '#addContactForm', (event) => {
      event.preventDefault();
      let newContactObj = this.apiCaller.serializeNewForm();

      if (this.inputValidation.contactValidate(newContactObj)) {
        this.apiCaller.saveContact(newContactObj);
        this.displayer.populateContacts(this.apiCaller.getAllContacts());
      } else {
        alert('Please Correct Information');
        this.inputValidation.specificValidationCheck(newContactObj);
      }
    });
  }

  cancelButtons() {
    $('body').on('click', '.cancel', () => {
      this.displayer.populateContacts();
    });
  }

  displayAddTagHandler() {
    $('.addTag').on('click', (event) => {
      event.preventDefault();
      this.displayer.displayAddTag();
    });
  }

  displayEditHandler() {
    $('main').on('click', '.editContactCard', async (event) => {
      let id = event.target.parentElement.parentElement.getAttribute('value');

      let singleContact = await this.apiCaller.getSingleContact(id);
      this.displayer.displayEditContact(singleContact);
    });
  }

  displayAddContactHandler() {
    $('body').on('click','.addContact', () => {
      $('main').empty();
      this.displayer.displayAddContact();
    });
  }

  deleteContactHandler() {
    $('main').on('click','.delete', event => {
      $('#areYouSure').show();
      $('#yesSure').val(event.target.value);
    });
  }

  filterContacts(letters) {
    this.apiCaller.getAllContacts()
      .then(contactList => {
        let list = contactList.filter(contact => {
          return contact.full_name.slice(0, letters.length)
            .toLowerCase() === letters.toLowerCase();
        });
        this.timer = null;
        this.displayer.populateContacts(new Promise(resolve => resolve(list)));
      })
      .catch(reject => console.error(reject));
  }

  filterContactsTags(tag) {
    let allContacts = this.apiCaller.getAllContacts();

    if (tag.toLowerCase() === 'clear') {
      this.displayer.populateContacts(allContacts);
      return;
    }

    allContacts
      .then(contactList => {
        let list = contactList.filter(contact => {
          let tags = contact.tags.toLowerCase().split(',');
          return tags.includes(tag.toLowerCase());
        });

        if (list.length > 0) {
          this.displayer.populateContacts(new Promise(res => res(list)));
        } else {
          this.displayer.noContactsWithTagDisplay(tag);
        }
      })
      .catch(reject => console.error(reject));
  }

  refresh() {
    let json = this.apiCaller.getAllContacts();
    this.displayer.populateContacts(json);
  }

  submitEditHandler() {
    $("main").on('submit', '#contactEditForm', (event) => {
      event.preventDefault();
      let obj = this.apiCaller.serializeForm();
      if (this.inputValidation.contactValidate(obj)) {
        this.apiCaller.updateContact(obj.id, obj);
        this.displayer.populateContacts();
      } else {
        alert('Please Correct Information');
        this.inputValidation.specificValidationCheck(obj);
      }
    });
  }

  searchHandler() {
    $('#search').on('keyup', () => {
      if (this.timer) clearTimeout(this.timer);
      let searchInput = $('#search').val();
      this.timer = setTimeout(async () => {
        await this.filterContacts(searchInput);
      }, 400);
    });
  }

  tagSearchHandler() {
    $('main').on('click', 'li', (event) => {
      this.filterContactsTags(event.target.textContent);
    });
  }
}