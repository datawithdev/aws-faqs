// Run this code in Chrome console to extract URLs on aws.amazon.com


var header, productname, url, faqurl, descr;

var el =  $("#m-nav-panel-products .m-nav-panel-link")

jQuery.each( el,  function( i, cur ) {

 if( $(cur).hasClass('m-nav-txt-large')) {
     // console.log("found header")
     header = $(cur).find('a').html();
    }
    productname = $(cur).find('a').text();
    descr= $(cur).find('a span').text();
    url =   $(cur).find('a').attr('href')
    faqurl = url.replace("?", "faqs/?")

    var line = header + '|' +  productname + '|' +  url + '|' + descr + '|' + faqurl + '\n'
    console.log(line)

});
