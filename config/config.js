module.exports = {
  name: 'Cortex XDR',
  acronym: 'CXDR',
  description: 'Search for Incidents, and XQL Queries',
  entityTypes: ['domain', 'IPv4', 'IPv6', 'hash', 'email', 'cve'],
  onDemandOnly: true,
  defaultColor: 'light-blue',
  styles: ['./client/styles.less'],
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
    level: 'trace' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'url',
      name: 'API URL',
      description:
        'The API Url for your Cortex XDR instance. NOTE: This is not the same as your Cortex XDR instance URL, but can be found at Configuration -> API Key -> Copy API URL',
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
      name: 'Do XQL Queries',
      description: 'Check if you want to run XQL Queries with the XQL Query String',
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
