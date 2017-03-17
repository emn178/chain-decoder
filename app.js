(function ($) {
  $(document).ready(function () {
    var input = $('#input');
    var output = $('#output');
    var checkbox = $('#auto-update');

    var execute = function () {
      try {
        var result = chainDecode(input.val().replace(/\n/g, ''));
        var str = '';
        str += '自發起日起到期：' + result.durationInDays + '\n';
        str += '集資目標：' + result.target + '\n';
        str += '發起人地址：' + result.ownerAddress + '\n';
        str += '專案名稱：' + result.name.replace(/\0/g, '') + '\n';
        str += '專案編號：' + result.description.replace(/\0/g, '') + '\n';
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
