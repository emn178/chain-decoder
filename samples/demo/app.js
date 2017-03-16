(function ($) {
  $(document).ready(function () {
    var input = $('#input');
    var output = $('#output');
    var checkbox = $('#auto-update');

    var execute = function () {
      try {
        var result = chainDecode(input.val());
        var str = '';
        str += 'Duration in days: ' + result.durationInDays + '\n';
        str += 'Target: ' + result.target + '\n';
        str += 'Owner address: ' + result.ownerAddress + '\n';
        str += 'Name: ' + result.name.replace(/\0/g, '') + '\n';
        str += 'Description: ' + result.description.replace(/\0/g, '') + '\n';
        output.val(str);
      } catch(e) {
        output.val(e);
      }
    }

    function autoUpdate() {
      if(!checkbox[0].checked) {
        return;
      }
      execute();
    }

    if (checkbox.length > 0) {
      input.bind('input propertychange', autoUpdate);
      checkbox.click(autoUpdate);
    }

    $('#execute').click(execute);
  });
})(jQuery);
