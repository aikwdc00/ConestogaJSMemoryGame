
$(document).ready(function () {
  // control tabs
  $("#tabs").tabs();

  // create card arr
  createCards()

  // get Setting
  settings.getSetting()

  // save setting
  $('#save_settings').click(settings.saveSetting)

  // click event
  $('.memoryCard').click(function () {
    cardsController.dispatchCardAction(this)
  })
});

