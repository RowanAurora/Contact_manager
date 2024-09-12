import { APICaller } from "./apiCaller.js";
import { Displayer } from "./display.js";
import { EventHandlers } from "./eventHandlers.js";
import { InputValidation } from "./inputValidation.js";

document.addEventListener('DOMContentLoaded', () => {
  let apiCaller = new APICaller();
  let displayer = new Displayer(apiCaller);
  let inputValidation = new InputValidation(displayer);
  let eventHandlers = new EventHandlers(apiCaller, displayer, inputValidation);
  eventHandlers.bindHandlers();
});
