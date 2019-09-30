let path = require('path')
let fs = require('fs')

/**
 * creates .arc if it does not exist (init command only)
 */
module.exports = function maybeCreate() {

  // get the cli args
  let args = process.argv.slice(0)

  // eslint-disable-next-line
  let binary = args.shift()

  // eslint-disable-next-line
  let binaryPath = args.shift()

  // grab the command and any options
  let cmd = args.shift()
  let opts = args.slice(0)

  // only run on init
  if (cmd === 'init') {
    // get the name passed in or use the current working directory name
    let name = opts[0] || process.cwd().split(path.sep).reverse().shift()
    // most basic default Architect app possible
    let arcFile = `@app
${name}

@http
get /

# Uncomment the following lines to deploy
# 'bucket' must be in the same region as 'region' (e.g. us-west-1)
# @aws
# region us-west-1
# bucket your-private-deploy-bucket
`

    let pathToArc = path.join(process.cwd(), '.arc')
    let pathToJSON = path.join(process.cwd(), 'arc.json')
    let pathToYAML = path.join(process.cwd(), 'arc.yaml')
    let pathToApp = path.join(process.cwd(), 'app.arc')

    let exists = fs.existsSync(pathToArc) ||
                 fs.existsSync(pathToJSON) ||
                 fs.existsSync(pathToYAML) ||
                 fs.existsSync(pathToApp)
    if (!exists) {
      // TODO pass params between 'before' fns so we don't have to set an env var
      process.env.INITIALIZED = true
      fs.writeFileSync(pathToArc, arcFile)
    }
  }
}