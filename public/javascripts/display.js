export class Displayer {
  constructor(apiCaller) {
    this.apiCaller = apiCaller;
    this.addedTags = ["Work", "Friends"];
    this.inUseTags = [];
    this.tags = [];
    this.updateTags();
    this.handlebarsSetUp();
    this.populateContacts();
  }

  displayAddContact() {
    $('main').append(this.addContactFormTemplate({tag: this.tags}));
    $("select").attr("size",$("select option").length);
  }

  displayAddTag() {
    $("main").fadeOut();
    $("main").hide();
    $("main").empty();
    $("main").append(this.addTagTemplate());
    $("main").fadeIn();
  }

  displayEditContact(json) {
    $("main").fadeOut();
    $("main").hide();
    $('main').empty();
    $('main').fadeIn();
    this.updateTags();
    $('main').append(this.editContactTemplate({tag: this.tags}));
    $('#editId').attr('value', json.id);
    $('#full_name').attr('value', json.full_name);
    $('#email').attr('value', json.email);
    $('#phone_number').attr('value', json.phone_number);

    let tags = json.tags.split(',');
    let options = [...document.querySelectorAll('option')];
    options.forEach(option => {
      if (tags.includes(option.value)) {
        $(option).attr('selected', 'selected');
      }
    });
    $("select").attr("size",$("select option").length);
  }

  handlebarsSetUp() {
    Handlebars.registerPartial("tagListPartial", $('#tagListPartial').html());
    Handlebars.registerPartial('contactCard', $("#contactCard").html());

    this.editContactTemplate = Handlebars.compile($("#editContact").html());
    this.noContactsTemplate = Handlebars.compile($('#noContacts').html());
    this.addContactFormTemplate = Handlebars.compile($("#addContact").html());
    this.contactCardTemplate = Handlebars.compile($("#contactPage").html());
    this.addTagTemplate = Handlebars.compile($('#createTag').html());
    this.tagListing = Handlebars.compile($('#tagButtonTemplate').html());
  }

  emptyMain() {
    $("main").fadeOut();
    $("main").hide();
    $('main').empty();
  }

  incorrect(selector) {
    $(`${selector}`).addClass('incorrect');
  }

  noContacts() {
    $('main').append(this.noContactsTemplate());
    let searchValue = $('#search').val();
    if (searchValue) {
      $('#noContactText').text("There are no contacts starting with " + searchValue);
    }
  }

  noContactsWithTagDisplay(tag) {
    $('main').empty()
    $('main').append(this.tagListing(this.addedTags));
    $('main').append('<p>No Contacts with this tag:' + tag + '</p>');
  }

  populateContacts(contact) {
    this.emptyMain();
    contact = contact || this.apiCaller.getAllContacts();
    this.updateTags(contact);
    contact.then(contact => {
      contact.forEach(contact => {
        contact.tags = contact.tags.split(',').join(', ');
      });
      if (contact.length < 1) {
        this.noContacts();
      } else {
        $('main').append(this.tagListing(this.tags));
        $('main').append(this.contactCardTemplate({contact}));
      }
      $('main').fadeIn();
    });
  }

  updateTags(x) {
    let contactPromise = x || this.apiCaller.getAllContacts();
    this.inUseTags = [];

    contactPromise.then(contacts => {
      contacts.forEach(contact => {
        let tags = contact.tags.split(',');
        tags.forEach(tag => {
          if (!this.inUseTags.includes(tag) && tag) {
            this.inUseTags.push(tag);
          }
        });
      });
      let tempTags = this.addedTags.concat(this.inUseTags);
      let result = [];
      tempTags.forEach(tag => {
        if (!result.includes(tag)) result.push(tag);
      });
      this.tags = result;
    });
  }
}