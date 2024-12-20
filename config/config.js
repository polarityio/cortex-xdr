module.exports = {
  name: 'Cortex XDR',
  acronym: 'CXDR',
  description: 'Search for Incidents and run XQL Queries',
  entityTypes: ["domain", "IPv4", "IPv6", "MD5", "SHA1", "SHA256", "email", "cve"],
  onDemandOnly: true,
  defaultColor: 'light-blue',
  styles: ['./client/styles.less'],
  onDemandOnly: true,
  block: {
    component: {
      file: './client/block.js'
    },
    template: {
      file: './client/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: ''
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'url',
      name: 'API URL',
      description:
        'The API Url for your Cortex XDR instance. NOTE: This is not the same as your Cortex XDR instance URL, but can be found at Configuration -> API Key -> Copy API URL.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'apiKey',
      name: 'API Key',
      description: 'An API Key on your Cortex XDR instance. Configuration -> API Key',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'apiKeyId',
      name: 'API Key ID',
      description:
        'The ID associated with your API Key. Configuration -> API Key -> ID Column',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'doXqlQueries',
      name: 'Run XQL Query',
      description:
        'If enabled, the integration will run the XQL Query specified by the "XQL Query String" option below. The XQL Query is run in addition to searching incidents. This option must be visible to users.',
      default: false,
      type: 'boolean',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'xqlQueryString',
      name: 'XQL Query String',
      description:
        'The XQL Query you want to use when Searching Entities. Example: `dataset = xdr_data | filter agent_id contains "{{ENTITY}}" or agent_hostname contains "{{ENTITY}}" or agent_ip_addresses contains "{{ENTITY}}"  | limit 10`',
      default:
        'dataset = xdr_data | filter agent_id contains "{{ENTITY}}" or agent_hostname contains "{{ENTITY}}" or agent_ip_addresses contains "{{ENTITY}}"  | limit 10',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    }
  ]
};
