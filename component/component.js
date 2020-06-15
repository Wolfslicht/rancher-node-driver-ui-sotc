/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
// https://github.com/rancher/ui/blob/master/lib/shared/addon/mixins/cluster-driver.js
import ClusterDriver from 'shared/mixins/cluster-driver';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along
// with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/


/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import
// them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed = Ember.computed;
const observer = Ember.observer;
const get = Ember.get;
const set = Ember.set;
const alias = Ember.computed.alias;
const service = Ember.inject.service;
const all = Ember.RSVP.all;
const reject = Ember.RSVP.reject;

const equal = Ember.computed.equal;
const next = Ember.run.next;
const setProperties = Ember.setProperties;

/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/
const domains = '*.otc.t-systems.com'
const clusterFlavors = [
  'cce.s1.small',
  'cce.s1.medium',
  'cce.s1.large',
  'cce.s2.small',
  'cce.s2.medium',
  'cce.s2.large',
  'cce.t1.small',
  'cce.t1.small',
  'cce.t1.medium',
  'cce.t1.large',
  'cce.t2.small',
  'cce.t2.medium',
  'cce.t2.large',
]
const defaultClusterFlavor = 'cce.s1.medium'
const clusterFlavorDetails = `Cluster flavor, which cannot be changed after the cluster is created.

    cce.s1.small: small-scale, single-master VM cluster (≤ 50 nodes)
    cce.s1.medium: medium-scale, single-master VM cluster (≤ 200 nodes)
    cce.s1.large: large-scale, single-master VM cluster (≤ 1,000 nodes)
    cce.t1.small: small-scale, single-master BMS cluster (≤ 10 nodes)
    cce.t1.medium: medium-scale, single-master BMS cluster (≤ 100 nodes)
    cce.t1.large: large-scale, single-master BMS cluster (≤ 500 nodes)
    cce.s2.small: small-scale, high availability VM cluster (≤ 50 nodes)
    cce.s2.medium: medium-scale, high availability VM cluster (≤ 200 nodes)
    cce.s2.large: large-scale, high availability VM cluster (≤ 1,000 nodes)
    cce.t2.small: small-scale, high availability BMS cluster (≤ 10 nodes)
    cce.t2.medium: medium-scale, high availability BMS cluster (≤ 100 nodes)
    cce.t2.large: large-scale, high availability BMS cluster (≤ 500 nodes)
`
const instanceFlavorReference = 'https://docs.otc.t-systems.com/en-us/usermanual/ecs/en-us_topic_0177512565.html'
const typeVM = 'VirtualMachine'
const clusterTypes = [ // only VM is implemented for now
  {
    label: 'Virtual Machine',
    value: typeVM
  },
  {
    label: 'Bare Metal',
    value: 'BareMetal'
  },
]
const os = "EulerOS 2.5"
const diskTypes = ['SATA', 'SAS', 'SSD']
const availabilityZones = [
  'eu-de-01',
  'eu-de-02',
  'eu-de-03',
]
const lbProtocols = [
  'TCP',
  'HTTP',
  'HTTPS',
]
const k8sVersions = {
  'latest': '',
  'v1.13':  'v1.13.10-r0',
  'v1.11':  'v1.11.7-r2',
}
const defaultBandwidth = 100
const defaultFloatingIPType = '5_bgp'
const defaultShareType = 'PER'
const defaultClusterCIDR = "172.16.0.0/16"
const authModes = {
  RBAC: 'rbac',
  x509: 'x509',
}
const networkModes = {
  'Overlay L2':      'overlay_l2',
  'Underlay IPVLAN': 'underlay_ipvlan',
  'VPC Router':      'vpc-router,',
}
const defaultNetworkMode = 'overlay_l2'
const authURL = 'https://iam.eu-de.otc.t-systems.com/v3/auth/tokens'

/**
 * Convert string array to field array
 * @param src {string[]}
 * @returns {{label, value}[]}
 */
function a2f(src) {
  return src.map((v) => ({ label: v, value: v }))
}

/**
 * Convert mapping to field array
 * @param src
 * @returns {{label, value}[]}
 */
function m2f(src) {
  return Object.entries(src).map((e) => ({ label: e[0], value: e[1] }))
}

function field(label, placeholder = '', detail = '') {
  return {
    label:       label,
    placeholder: placeholder,
    detail:      detail,
  }
}

function chapter(title, detail = '', next) {
  return {
    title:  title,
    next:   next,
    detail: detail,
  }
}

const languages = {
  'en-us': {
    cluster: {
      auth:                    chapter(
        'Account Configuration',
        'OTC credentials',
        'Next: Configure Cluster',
      ),
      'ak/sk':                 field('Use AK/SK auth'),
      // ak/sk auth:
      accessKey:               field('Access Key ID'),
      secretKey:               field('Secret Access key'),
      // token-based auth:
      token:                   field('Token'),
      domainName:              field('Domain Name', 'OTC00000000000000000XXX'),
      username:                field('Username'),
      password:                field('Password'),
      projectName:             field('Project Name', 'eu-de'),
      // cluster config
      cluster:                 chapter(
        'Cluster Configuration',
        'General cluster configuration',
        'Next: Network configuration',
      ),
      clusterType:             field(
        'Cluster Type'
      ),
      clusterVersion:          field(
        'Kubernetes Version',
        'Version of kubernetes installed on cluster'
      ),
      clusterFlavor:           field(
        'Cluster Flavor',
        '',
        clusterFlavorDetails,
      ),
      clusterLabels:           field('Cluster Labels'),
      nodeCount:               field('Node Count'),
      // network info
      network:                 chapter(
        'Network configuration',
        'Networking configuration',
        'Next: Cluster Floating IP',
      ),
      vpcName:                 field(
        'Virtual Private Cloud',
        'vpc-01',
        'Name of VPC (existing or new)',
      ),
      subnetName:              field(
        'Subnet',
        'subnet-01',
        'Name of Subnet (existing or new)',
      ),
      containerNetworkMode:    field('Container Network Mode'),
      containerNetworkCidr:    field('Container Network CIDR'),
      // Cluster eip options
      masterFloatingIp:        chapter(
        'Cluster Floating IP',
        'Floating IP configuration for master node',
        'Next: Node Configuration'
      ),
      newMasterEip:            field('Create New Floating IP'),
      oldMasterEip:            field('Use Existing Floating IP'),
      clusterFloatingIp:       field(
        'Existing floating IP',
        '0.0.0.0',
      ),
      clusterEipBandwidthSize: field(
        'Bandwidth Size',
      ),
      // node config
      node:                    chapter(
        'Node Configuration',
        'Configure instances used as cluster nodes',
        'Next: Nodes disk configuration',
      ),
      nodeFlavor:              field(
        'Node Flavor',
        '',
        `See ${instanceFlavorReference} for available flavors`,
      ),
      availabilityZone:        field('Availability Zone'),
      useExistingKeyPair:      field('Use existing key pair'),
      keyPair:                 field('SSH Key Pair'),
      publicKey:               field('Nodes public key'),
      // disk config
      disk:                    chapter(
        'Disks Configuration',
        'Configure the disks attached to node instances',
        'Next: Setup Load Balancer',
      ),
      rootVolumeSize:          field(
        'Root Disk Size, GB',
        '40',
        'Minimum 40 GB'
      ),
      rootVolumeType:          field('Root Disk Type'),
      dataVolumeSize:          field(
        'Data Disk Size, GB',
        '100',
        'Minimum 100 GB'
      ),
      dataVolumeType:          field('Data Disk Type'),
      // LB bandwidth config
      loadbalancer:            chapter(
        'Loadbalancer configuration',
        'Configure LB',
        'Finish & Create Cluster'
      ),
      createLoadBalancer:      field('Use load balancer for node access'),
      newLBEip:                field('Create New Floating IP'),
      oldLBEip:                field('Use Existing Floating IP'),
      lbProtocol:              field('Load Balancer Protocol'),
      lbPort:                  field('Load Balancer Port'),
      lbFloatingIp:            field(
        'Existing Floating IP',
        '0.0.0.0',
      ),
      lbBandwidth:             field(
        'Bandwidth Size (MBit/s)',
      ),
      loadingNext:             'Loading Next...',
      newVPC:                  'Create New VPC',
      newSubnet:               'Create New Subnet',
    }
  }
};
// cluster configuration steps
const Steps = Object.freeze({
  auth:       10,
  cluster:    20,
  network:    30,
  clusterEip: 40,
  node:       50,
  disk:       60,
  lbEip:      70,
})

/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(ClusterDriver, {
  driverName:  '%%DRIVERNAME%%',
  configField: '%%DRIVERNAME%%EngineConfig', // 'otcEngineConfig'
  config:      alias('cluster.%%DRIVERNAME%%EngineConfig'),
  app:         service(),
  router:      service(),
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/
  intl:        service(),

  isNew:      equal('mode', 'new'),
  editing:    equal('mode', 'edit'),
  lanChanged: null,
  refresh:    false,
  step:       Steps.auth,

  token:        {},
  vpcs:         [],
  subnets:      [],
  vpcEndpoint:  '',
  novaEndpoint: '',

  newVPC:    { create: false, name: '', cidr: '192.168.0.0/16' },
  newSubnet: { create: false, name: '', cidr: '192.168.0.0/24', gatewayIP: '192.168.0.1' },

  init() {
    /*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'shared/components/cluster-driver/driver-%%DRIVERNAME%%/template'
    });
    set(this, 'layout', template);

    this._super(...arguments);
    /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

    const lang = get(this, 'session.language') || 'en-us';
    get(this, 'intl.locale');
    this.loadLanguage(lang);

    let config = get(this, 'cluster.otcEngineConfig')
    let configField = get(this, 'configField')

    console.log('Config is ' + JSON.stringify(config))

    if (!config || JSON.stringify(config) === "{}") {  // observers initializes context
      config = get(this, 'globalStore').createRecord({
        type:                    configField,
        // authentication
        // ak/sk
        accessKey:               '',
        secretKey:               '',
        // token auth
        token:                   '',
        username:                '',
        password:                '',
        domainName:              '',
        projectName:             '',
        region:                  'eu-de',
        // cluster settings
        clusterName:             '',
        displayName:             '',
        clusterVersion:          '',
        clusterType:             typeVM,
        clusterFlavor:           defaultClusterFlavor,
        nodeCount:               2,
        clusterLabels:           ['origin=rancher-otc'],
        // cluster networking
        vpcId:                   '',
        subnetId:                '',
        containerNetworkMode:    defaultNetworkMode,
        containerNetworkCidr:    defaultClusterCIDR,
        // master eip
        clusterFloatingIp:       '',
        clusterEipBandwidthSize: defaultBandwidth,
        clusterEipType:          defaultFloatingIPType,
        clusterEipShareType:     defaultShareType,
        // nodes auth
        authenticationMode:      authModes.RBAC,
        authProxyCa:             '',
        // nodes config
        availabilityZone:        '',
        nodeFlavor:              's2.large.2',
        os:                      os,
        keyPair:                 '',
        // node disks
        rootVolumeSize:          40,
        dataVolumeSize:          100,
        rootVolumeType:          diskTypes[0],
        dataVolumeType:          diskTypes[0],
        // LB config
        createLoadBalancer:      true,
        lbFloatingIp:            '',
        appPort:                 8080,
        appProtocol:             'TCP',
        lbEipBandwidthSize:      defaultBandwidth,
        lbEipType:               defaultFloatingIPType,
        lbEipShareType:          defaultShareType,
      });
    }
    set(this, 'config', config);
    set(this, `cluster.${configField}`, config);
    set(this, 'cluster.driver', get(this, 'driverName'));

    if (this.editing) {
      set(this, 'newMasterIP', false)
    }
  },

  createVPC(cb) {
    return get(this, 'otc').createVPC(
      get(this, 'newVPC.name'),
      get(this, 'newVPC.cidr'),
    ).then((vpcID) => {
      set(this, 'config.vpcId', vpcID)
      set(this, 'newVPC.create', false)
      set(this, 'newVPC.name', '')
      set(this, 'errors', [])
      this.updateVPCs()
      cb(true)
    }).catch((er) => {
      set(this, 'newVPC.name', '')
      set(this, 'errors', [JSON.stringify(er)])
      cb(false)
    })
  },
  createSubnet(cb) {
    return get(this, 'otc').createSubnet(
      get(this, 'config.vpcId'),
      get(this, 'newSubnet.name'),
      get(this, 'newSubnet.cidr'),
      get(this, 'newSubnet.gatewayIP'),
    ).then((subnetID) => {
      set(this, 'config.subnetId', subnetID)
      set(this, 'newSubnet.name', '')
      set(this, 'newSubnet.create', false)
      set(this, 'errors', [])
      this.updateSubnets()
      cb(true)
    }).catch((er) => {
      set(this, 'newSubnet.name', '')
      set(this, 'errors', [JSON.stringify(er)])
      cb(false)
    })
  },

  actions: {
    save(cb) {
      if (get(this, 'editing')) {
        console.log('Saving driver with config: \n' + JSON.stringify(get(this, 'cluster')))
        this.send('driverSave', cb);
        return
      }
      const step = get(this, 'step')
      switch (step) {
        case Steps.auth:
          return this.toClusterConfig(cb)
        case Steps.cluster:
          return this.toNetworkConfig(cb)
        case Steps.network:
          const newVPC = get(this, 'newVPC.create')
          const newSubnet = get(this, 'newSubnet.create')
          console.log('Need new VPC? ' + newVPC)
          console.log('Need new subnet? ' + newSubnet)
          if (newVPC) {
            return this.createVPC(cb)
          }
          if (newSubnet) {
            return this.createSubnet(cb)
          }
          return this.toClusterEip(cb)
        case Steps.clusterEip:
          return this.toNodeConfig(cb)
        case Steps.node:
          return this.toDiskConfig(cb)
        case Steps.disk:
          return this.tolbFloatingIp(cb)
        default:
          console.log('Saving driver with config: \n' + JSON.stringify(get(this, 'cluster')))
          this.send('driverSave', cb);
      }
    },
    cancel() {
      // probably should not remove this as its what every other driver uses to get back
      get(this, 'router').transitionTo('global-admin.clusters.index');
    },
  },


  // Add custom validation beyond what can be done from the config API schema
  validate() {
    // Get generic API validation errors
    this._super();
    const errors = get(this, 'errors') || [];
    if (!get(this, 'cluster.name')) {
      errors.push('Name is required');
    }

    // Set the array of errors for display,
    // and return true if saving should continue.
    if (get(errors, 'length')) {
      set(this, 'errors', errors);
      return false;
    } else {
      set(this, 'errors', null);
      return true;
    }
  },

  // Any computed properties or custom logic can go here
  azChoices:             a2f(availabilityZones),
  clusterVersionChoices: m2f(k8sVersions),
  clusterTypeChoices:    clusterTypes,
  diskTypeChoices:       a2f(diskTypes),
  networkModeChoices:    m2f(networkModes),
  lbProtocolChoices:     a2f(lbProtocols),

  otc: computed('config.region', function () {
    return otcClient(get(this, 'config.region'))
  }),

  authFieldsMissing:  true,
  onAuthFieldsChange: observer('config.username', 'config.password', 'config.domainName', 'config.projectName', function () {
    const missing = !(
      get(this, 'config.username') &&
      get(this, 'config.password') &&
      get(this, 'config.domainName') &&
      get(this, 'config.projectName')
    )
    set(this, 'authFieldsMissing', missing)
  }),

  newVPCFieldsMissing:    false,
  onNewVPCInput:          observer('newVPC.create', 'newVPC.name', 'newVPC.cidr', function () {
    const missing = get(this, 'newVPC.create') &&
      !(get(this, 'newVPC.name') && get(this, 'newVPC.cidr'))
    set(this, 'newVPCFieldsMissing', missing)
  }),
  newSubnetFieldsMissing: false,
  onNewSubnetInput:       observer('newSubnet.create', 'newSubnet.name', 'newSubnet.cidr', function () {
    const missing = get(this, 'newSubnet.create') &&
      !(get(this, 'newSubnet.name') && get(this, 'newSubnet.cidr') && get(this, 'newSubnet.gatewayIP'))
    console.log('Missing Subnet fields?', missing)
    set(this, 'newSubnetFieldsMissing', missing)
  }),
  networkFieldsMissing:   true,
  onNetworkFieldsChange:  observer('config.vpcId', 'config.subnetId', 'newVPC.create', 'newSubnet.create', 'newVPCFieldsMissing', 'newSubnetFieldsMissing', function () {
    if (get(this, 'newVPC.create')) {
      set(this, 'networkFieldsMissing', get(this, 'newVPCFieldsMissing'))
      return
    }
    if (get(this, 'newSubnet.create')) {
      set(this, 'networkFieldsMissing', get(this, 'newSubnetFieldsMissing'))
      return
    }
    set(this, 'networkFieldsMissing', !(get(this, 'config.vpcId') && get(this, 'config.subnetId')))

  }),

  fieldsMissing: computed('step', 'authFieldsMissing', 'networkFieldsMissing', 'config.keyPair', function () {
    const step = get(this, 'step')
    if (get(this, 'editing')) {
      return false
    }
    switch (step) {
      case Steps.auth:
        return get(this, 'authFieldsMissing')
      case Steps.network:
        return get(this, 'networkFieldsMissing')
      case Steps.node:
        return !get(this, 'config.keyPair')
      default:
        return false
    }
  }),

  createLabel:  computed('step', 'newVPC.create', 'newSubnet.create', function () {
    const step = get(this, 'step')
    switch (step) {
      case Steps.auth:
        return 'cluster.auth.next'
      case Steps.cluster:
        return 'cluster.cluster.next'
      case Steps.network:
        const newVPC = get(this, 'newVPC.create')
        const newSubnet = get(this, 'newSubnet.create')
        if (newVPC) {
          return 'cluster.newVPC'
        }
        if (newSubnet) {
          return 'cluster.newSubnet'
        }
        return 'cluster.network.next'
      case Steps.clusterEip:
        return 'cluster.masterFloatingIp.next'
      case Steps.node:
        return 'cluster.node.next'
      case Steps.disk:
        return 'cluster.disk.next'
      case Steps.lbEip:
        return 'cluster.loadbalancer.next'
      default:
        return 'Finish'
    }
  }),
  needLB:       computed('config.createLoadBalancer', function () {
    return get(this, 'config.createLoadBalancer')
  }),
  newLBEip:     true,
  newMasterIP:  true,  // just for initial value
  needNewLBEip: computed('needLB', 'newLBEip', function () {
    if (this.editing) {
      return false
    }
    return get(this, 'needLB') && get(this, 'newLBEip')
  }),

  clusterNameChanged: observer('cluster.name', function () {
    const name = get(this, 'cluster.name')
    console.log('Cluster name is ' + name + ' now')
    set(this, 'config.clusterName', name)
    set(this, 'config.name', name)
    set(this, 'config.displayName', name)
  }),

  languageChanged: observer('intl.locale', function () {
    const lang = get(this, 'intl.locale');
    if (lang) {
      this.loadLanguage(lang[0]);
    }
  }),

  authClient() {
    return get(this, 'otc').authenticate(
      get(this, 'config.username'),
      get(this, 'config.password'),
      get(this, 'config.domainName'),
      get(this, 'config.projectName'),
    ).then(() => {
      return resolve()
    }).catch((e) => {
      set(this, 'errors', [e])
      return reject()
    })
  },

  vpcChoices: computed('vpcs', function () {
    const vpcs = get(this, 'vpcs')
    return vpcs.map((vpc) => ({ label: `${vpc.name} (${vpc.id})`, value: vpc.id }))
  }),
  updateVPCs: function () {
    return get(this, 'otc').listVPCs().then((vpcs) => {
      set(this, 'vpcs', vpcs)
      return resolve()
    }).catch(() => {
      console.error('Failed to get VPCs')
      return reject()
    })
  },

  subnetChoices: computed('subnets', function () {
    const subnets = get(this, 'subnets')
    return subnets.map((sn) => ({ label: `${sn.name}(${sn.cidr})`, value: sn.id }))
  }),
  updateSubnets: function () {
    const vpcId = get(this, 'config.vpcId')
    if (!vpcId) {
      return []
    }
    return get(this, 'otc').listSubnets(vpcId).then((subnets) => {
      console.log('Subnets: ', subnets)
      set(this, 'subnets', subnets)
      return resolve()
    }).catch((e) => {
      console.error('Failed to get subnets: ', e)
      return reject()
    })
  },
  vpcUpdated:    observer('config.vpcId', function () {
    this.updateSubnets()
  }),

  nodeFlavorChoices: computed('token', function () {
    return get(this, 'otc').listNodeFlavors().then((flavors) => {
      console.log('Flavors: ', flavors)
      return flavors.map((f) => ({ label: f.name, value: f.id }))
    }).catch(() => {
      console.log('Failed to load node flavors')
    })
  }),

  keyPairChoices: computed('token', function () {
    if (get(this, 'token') === '') {
      return []
    }
    return get(this, 'otc').listKeyPairs().then((keyPairs) => {
      console.log('Received key pairs: ', keyPairs)
      return keyPairs.map((k) => {
        let name = k.keypair.name
        if (name.length > 20) {
          name = name.substring(0, 17) + '...'
        }
        return {
          label: `${name} (${k.keypair.fingerprint})`,
          value: k.keypair.name
        }
      })
    }).catch(() => {
      console.log('Failed to load key pairs')
      return reject()
    })
  }),

  clusterFlavorChoices: computed('config.clusterType', function () {
    const typ = get(this, 'config.clusterType')
    console.log('Cluster type is ', typ)
    const prefix = typ === typeVM ? 'cce.s' : 'cce.t'
    const validFlavors = clusterFlavors.filter((v) => v.startsWith(prefix))
    console.log('Available cluster flavors: ', JSON.stringify(validFlavors))
    return a2f(validFlavors)
  }),

  maxNodes: computed('config.clusterFlavor', function () {
    const config = get(this, 'config.clusterFlavor')
    const [_, __, size] = config.split('.')
    switch (size) {
      case 'small':
        return 50
      case 'medium':
        return 200
      case 'large':
        return 1000
    }
  }),

  limitNodes: observer('maxNodes', function () {
    const max = get(this, 'maxNodes')
    if (get(this, 'config.nodeCount') > max) {
      set(this, 'config.nodeCount', max)
    }
  }),

  networkCreationDisabled: computed('step', function () {
    const step = get(this, 'step')
    return step !== Steps.network
  }),

  loadLanguage(lang) {
    const translation = languages[lang];
    const intl = get(this, 'intl');

    intl.addTranslations(lang, translation);
    intl.translationsFor(lang);
    console.log('Added translation for ' + lang)
    set(this, 'refresh', false);
    next(() => {
      set(this, 'refresh', true);
      set(this, 'lanChanged', +new Date());
    });
  },

  toClusterConfig(cb) {
    setProperties(this, {
        'errors':             [],
        'config.username':    get(this, 'config.username').trim(),
        'config.domainName':  get(this, 'config.domainName').trim(),
        'config.projectName': get(this, 'config.projectName').trim(),
      }
    );
    return this.authClient().then(() => {
      console.log('Move to cluster configuration');
      set(this, 'step', Steps.cluster);
      this.updateVPCs()
      cb(true)
    }).catch((e) => {
      console.log('Failed to authorize\n' + e)
      cb(false)
    })
  },
  toNetworkConfig(cb) {
    set(this, 'errors', [])
    set(this, 'step', Steps.network)
    cb(true)
  },
  toClusterEip(cb) {
    set(this, 'errors', [])
    set(this, 'step', Steps.clusterEip)
    cb(true)
  },
  toNodeConfig(cb) {
    set(this, 'errors', [])
    set(this, 'step', Steps.node)
    cb(true)
  },
  toDiskConfig(cb) {
    set(this, 'errors', [])
    set(this, 'step', Steps.disk)
    cb(true)
  },
  tolbFloatingIp(cb) {
    set(this, 'errors', [])
    set(this, 'step', Steps.lbEip)
    cb(true)
  },

})
