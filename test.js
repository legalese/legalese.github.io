const blc = require('broken-link-checker')

console.log('Known false positives:')
console.log('Jstor links, NPR links, Imperial links')


let acc = []

const siteChecker = new blc.SiteChecker(acc, {
  link: function(result, customData) {
    if (result.broken) {
      console.error(`${result.url.original} is broken because of ${result.brokenReason}`)
      // console.error(`Found on ${result.base.original}`)
      acc.push(result)
    }
  },
  end: function() {
    console.log('Finished checks')
    console.log(`There are a grand total of ${acc.length} broken links.`)
    console.log(`Please review the log below and fix them as necessary.`)
    console.log(`${acc.map(a=> `In ${a.base.original}: ${a.url.original}`).join('\n')}`)
  }
})

siteChecker.enqueue('http://localhost', acc)
