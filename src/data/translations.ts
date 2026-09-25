export type Language = 'en' | 'zh' | 'sw' | 'ar';

export interface TranslationSchema {
  /*
    SCREEN COPY, extracted from the components.

    Every user-facing string that was written directly into JSX now has a key here, so the four
    languages cover the whole application rather than the navigation shell.

    STATUS: English is the source language. Some Chinese, Swahili and Arabic UI values are still
    exact English placeholders and are counted in PENDING_TRANSLATIONS. The count detects exact
    matches only; it does not detect English fragments inside otherwise translated copy.
  */
  ui: {
    bookingCalendar: {
      's_07499a': string;
      's_10422c': string;
      's_183a37': string;
      's_534c34': string;
      's_71b856': string;
      's_79caea': string;
      's_8efff8': string;
      's_aeb91b': string;
      's_e5366b': string;
      's_fdc2b8': string;
    };
    cartDrawer: {
      's_11a9f0': string;
      's_1fc724': string;
      's_2303a3': string;
      's_237e47': string;
      's_2c7952': string;
      's_42cb61': string;
      's_44951e': string;
      's_643b96': string;
      's_733b61': string;
      's_76ecba': string;
      's_ab8546': string;
      's_c7085d': string;
      's_d2467b': string;
      's_d2f4d4': string;
      's_d6ea26': string;
    };
    categories: {
      's_1a9863': string;
    };
    categoryExplorerModal: {
      's_233e38': string;
      's_7c267a': string;
      's_7fd08b': string;
      's_940323': string;
      's_af1c10': string;
      's_c7fa37': string;
      's_c9f43c': string;
      's_e37ac9': string;
      's_f4cf7c': string;
    };
    categoryPage: {
      's_004d7e': string;
      's_062888': string;
      's_2cef94': string;
      's_41eb8f': string;
      's_c4baea': string;
      's_fce284': string;
    };
    checkoutSimulatedModal: {
      's_119c2f': string;
      's_19e2a2': string;
      's_3a7a99': string;
      's_55e54d': string;
      's_635949': string;
      's_63da07': string;
      's_6aa79c': string;
      's_7db213': string;
      's_846466': string;
      's_882f46': string;
      's_9ad55a': string;
      's_ac51d0': string;
      's_b79126': string;
      's_bac774': string;
      's_bb36a9': string;
      's_cecb67': string;
      's_dd0a60': string;
      's_e5297b': string;
      's_e569ab': string;
      's_ea3289': string;
      's_ea4478': string;
      's_eb034a': string;
      's_ee343f': string;
      's_fee23b': string;
    };
    consentBanner: {
      's_35c291': string;
      's_66cd82': string;
      's_788df5': string;
      's_821d1f': string;
      's_956fa7': string;
      's_9e0cba': string;
      's_da6a92': string;
      's_e7d306': string;
      's_f477c8': string;
    };
    courierOnboarding: {
      's_037e0b': string;
      's_03c52e': string;
      's_06c8b6': string;
      's_0b39f6': string;
      's_0bd62e': string;
      's_0cb44f': string;
      's_0d36d5': string;
      's_0d98d0': string;
      's_0e3256': string;
      's_0f32ec': string;
      's_1081b3': string;
      's_10f420': string;
      's_14bf35': string;
      's_156177': string;
      's_17b238': string;
      's_1805c7': string;
      's_197646': string;
      's_204be3': string;
      's_2358e6': string;
      's_24813d': string;
      's_26712f': string;
      's_27538f': string;
      's_27980f': string;
      's_27c646': string;
      's_2952ca': string;
      's_2b31a3': string;
      's_2cb0d8': string;
      's_2d6ca0': string;
      's_2dc8f1': string;
      's_2ed783': string;
      's_30b928': string;
      's_310c80': string;
      's_312631': string;
      's_3174a5': string;
      's_31843b': string;
      's_338cf2': string;
      's_340115': string;
      's_34e784': string;
      's_34f9ae': string;
      's_377b90': string;
      's_37dfba': string;
      's_3873df': string;
      's_3af714': string;
      's_3ba957': string;
      's_3bfd88': string;
      's_3c3541': string;
      's_3c774b': string;
      's_3cc4fd': string;
      's_3ce5aa': string;
      's_41d914': string;
      's_41fe24': string;
      's_430404': string;
      's_44fe57': string;
      's_464dfd': string;
      's_4979be': string;
      's_4c7486': string;
      's_4c987a': string;
      's_4d1c2f': string;
      's_4ff862': string;
      's_50d865': string;
      's_5104d5': string;
      's_51dacf': string;
      's_53d718': string;
      's_55537f': string;
      's_574f02': string;
      's_587649': string;
      's_5920ae': string;
      's_5a833b': string;
      's_5b5250': string;
      's_5cfa43': string;
      's_5f5518': string;
      's_63a113': string;
      's_64346b': string;
      's_6790f2': string;
      's_692fe8': string;
      's_6b3d6a': string;
      's_6f9c91': string;
      's_70abeb': string;
      's_714406': string;
      's_717eb1': string;
      's_71c904': string;
      's_71ebbb': string;
      's_71f6e3': string;
      's_72a587': string;
      's_74955f': string;
      's_76af1d': string;
      's_77522e': string;
      's_79865b': string;
      's_7cf2e1': string;
      's_7d5f6e': string;
      's_7d8667': string;
      's_81db77': string;
      's_827c49': string;
      's_828ade': string;
      's_831dc7': string;
      's_86d4ca': string;
      's_8bb6da': string;
      's_8d5d4c': string;
      's_8e203d': string;
      's_8f912f': string;
      's_903d8d': string;
      's_913798': string;
      's_93457d': string;
      's_93e220': string;
      's_9691d0': string;
      's_984805': string;
      's_99dc14': string;
      's_9d159c': string;
      's_a0094a': string;
      's_a1524d': string;
      's_a1c4fe': string;
      's_a221a1': string;
      's_a40d60': string;
      's_a620a5': string;
      's_a7c94e': string;
      's_a85feb': string;
      's_a8caa4': string;
      's_aafa84': string;
      's_ac26fd': string;
      's_ad7df6': string;
      's_aed4fc': string;
      's_aef6a9': string;
      's_af7bb7': string;
      's_af8a4e': string;
      's_b026ba': string;
      's_b09e88': string;
      's_b21f30': string;
      's_b2e0a8': string;
      's_b5015c': string;
      's_b5c479': string;
      's_b724e7': string;
      's_b984fa': string;
      's_b9d00c': string;
      's_bc5303': string;
      's_bf24cb': string;
      's_c1ecb3': string;
      's_c33c9b': string;
      's_c59900': string;
      's_c7a051': string;
      's_c85d99': string;
      's_c8708a': string;
      's_c8bc71': string;
      's_c8ed49': string;
      's_ca5690': string;
      's_cabacd': string;
      's_cdec1f': string;
      's_d101b7': string;
      's_d5184b': string;
      's_d5e54c': string;
      's_d64903': string;
      's_d66864': string;
      's_d9863a': string;
      's_db3b79': string;
      's_dca3fc': string;
      's_ddb4d1': string;
      's_de744b': string;
      's_e04a0d': string;
      's_e07446': string;
      's_e0934e': string;
      's_e12ee9': string;
      's_e15c6c': string;
      's_e16a80': string;
      's_e1c6ae': string;
      's_e1fe05': string;
      's_e21ec5': string;
      's_e387b2': string;
      's_e3ca9b': string;
      's_e4c574': string;
      's_e7710e': string;
      's_e7cfff': string;
      's_e90701': string;
      's_eb6915': string;
      's_ec9a3f': string;
      's_ecd675': string;
      's_eeec98': string;
      's_ef8482': string;
      's_efbb4c': string;
      's_f3a211': string;
      's_f4afb4': string;
      's_f65568': string;
      's_f6da6f': string;
      's_f71ebc': string;
      's_f954ab': string;
      's_f9f8d5': string;
      's_fa0cdb': string;
      's_fbbe43': string;
      's_fca1ec': string;
      's_feb1b4': string;
      's_febf86': string;
    };
    curatedNairobiWorlds: {
      's_15a714': string;
      's_18a51d': string;
      's_41dd82': string;
      's_52c035': string;
      's_8abe87': string;
      's_c2018d': string;
      's_ecc198': string;
      's_fe8da0': string;
    };
    databaseSqlModal: {
      's_baaf3a': string;
    };
    dateTimeField: {
      's_46a299': string;
      's_7ecc8b': string;
      's_8abf7c': string;
    };
    discoveryScreen: {
      's_030851': string;
      's_0b7ee2': string;
      's_176135': string;
      's_412226': string;
      's_67300d': string;
      's_8344a6': string;
      's_a3c57f': string;
      's_dfe60c': string;
      's_f4d948': string;
    };
    dishCustomizerModal: {
      's_052b34': string;
      's_062e79': string;
      's_1c711d': string;
      's_2db328': string;
      's_492026': string;
      's_594a3d': string;
      's_6c02ab': string;
      's_70d3a5': string;
      's_84ab4b': string;
      's_9c0406': string;
      's_a196bb': string;
      's_bfae0e': string;
      's_d0fac0': string;
      's_ece1f0': string;
    };
    dockedSearchBar: {
      's_67300d': string;
    };
    experiences: {
      's_057742': string;
      's_14c995': string;
      's_574a76': string;
      's_63ae7c': string;
      's_6568e5': string;
      's_96ebfb': string;
      's_9fda6b': string;
      's_a1e9f9': string;
      's_ad3a34': string;
      's_cebc44': string;
      's_d29299': string;
      's_eb9e1e': string;
      's_f6e8ce': string;
    };
    floatingCartBar: {
      's_f40d71': string;
    };
    forCouriers: {
      's_06816c': string;
      's_08c1c3': string;
      's_0c343a': string;
      's_0c8a9a': string;
      's_0e840b': string;
      's_110158': string;
      's_153ab5': string;
      's_18414d': string;
      's_1bedd8': string;
      's_1d2be9': string;
      's_209f63': string;
      's_22d1d3': string;
      's_2a7274': string;
      's_2bf27f': string;
      's_2d816d': string;
      's_2e6151': string;
      's_2ed1ed': string;
      's_33b4c6': string;
      's_3500ab': string;
      's_355ac2': string;
      's_38769a': string;
      's_38df83': string;
      's_39bc68': string;
      's_41493f': string;
      's_42475b': string;
      's_440245': string;
      's_45b640': string;
      's_4748c1': string;
      's_4c36e1': string;
      's_4d5b64': string;
      's_4d81b2': string;
      's_4f555f': string;
      's_5150fd': string;
      's_52a6f3': string;
      's_530246': string;
      's_53cdfb': string;
      's_54c4b5': string;
      's_5b8964': string;
      's_5ce9fd': string;
      's_5e7925': string;
      's_653ccb': string;
      's_677710': string;
      's_6bde0a': string;
      's_6d1c48': string;
      's_75dde0': string;
      's_765f2b': string;
      's_777b12': string;
      's_78df83': string;
      's_7e32e7': string;
      's_7f255f': string;
      's_8049d9': string;
      's_85cf78': string;
      's_89bdbf': string;
      's_8b1193': string;
      's_928714': string;
      's_933192': string;
      's_93a5bc': string;
      's_93fef0': string;
      's_95e986': string;
      's_97b846': string;
      's_981b01': string;
      's_9ad0cc': string;
      's_9b1690': string;
      's_9d3f52': string;
      's_9db108': string;
      's_a08321': string;
      's_a1e9f9': string;
      's_a7acb1': string;
      's_a9577d': string;
      's_ad6c0d': string;
      's_aed5c5': string;
      's_b53080': string;
      's_b74c4e': string;
      's_bc89aa': string;
      's_befa37': string;
      's_c10fec': string;
      's_c18810': string;
      's_c24cae': string;
      's_c38c49': string;
      's_c71f96': string;
      's_c88176': string;
      's_c887b9': string;
      's_ce60db': string;
      's_ce7472': string;
      's_d44881': string;
      's_d781b4': string;
      's_df9144': string;
      's_e10068': string;
      's_e18d8e': string;
      's_e3a7a2': string;
      's_e3b925': string;
      's_e6e178': string;
      's_e72e94': string;
      's_eb35f1': string;
      's_ec3c35': string;
      's_eeb176': string;
      's_f370c7': string;
      's_f582d4': string;
      's_f6e64a': string;
      's_fbe3b3': string;
      's_fcf600': string;
      's_ff2382': string;
    };
    forMerchants: {
      's_032a19': string;
      's_0c343a': string;
      's_0eaa2f': string;
      's_118503': string;
      's_1600e2': string;
      's_18414d': string;
      's_2bf27f': string;
      's_2f5b37': string;
      's_38769a': string;
      's_3f3d89': string;
      's_4d81b2': string;
      's_52a6f3': string;
      's_540349': string;
      's_591721': string;
      's_673bf7': string;
      's_750959': string;
      's_771412': string;
      's_7cb113': string;
      's_80b451': string;
      's_81df05': string;
      's_85feef': string;
      's_891482': string;
      's_89a9da': string;
      's_916b2f': string;
      's_a1e9f9': string;
      's_a2e8c7': string;
      's_a92592': string;
      's_aa32fa': string;
      's_abafb4': string;
      's_ae23a7': string;
      's_b74c4e': string;
      's_ba7223': string;
      's_c0228a': string;
      's_c24cae': string;
      's_c75030': string;
      's_c89f38': string;
      's_ce7472': string;
      's_ce9fe6': string;
      's_d6626f': string;
      's_da08fb': string;
      's_def7cc': string;
      's_e3b925': string;
      's_e56df8': string;
      's_e6a013': string;
      's_e9cbdf': string;
      's_f6538e': string;
      's_f6e1bd': string;
      's_faae3e': string;
      's_fe1a29': string;
    };
    forProperties: {
      's_0293af': string;
      's_052b34': string;
      's_061f53': string;
      's_06fb24': string;
      's_0a3693': string;
      's_0c8a9a': string;
      's_0d3b7b': string;
      's_0e5ae2': string;
      's_110158': string;
      's_110820': string;
      's_176079': string;
      's_17d67c': string;
      's_182ad0': string;
      's_18414d': string;
      's_1be9e5': string;
      's_1d2be9': string;
      's_21f4bb': string;
      's_25096d': string;
      's_271358': string;
      's_29b967': string;
      's_2bf27f': string;
      's_31c559': string;
      's_338ed9': string;
      's_341a50': string;
      's_38769a': string;
      's_3b6c18': string;
      's_40c759': string;
      's_4216f1': string;
      's_46f477': string;
      's_49f179': string;
      's_4c36e1': string;
      's_4d2dec': string;
      's_4d81b2': string;
      's_4f7049': string;
      's_4fdd58': string;
      's_52a6f3': string;
      's_534294': string;
      's_53cdfb': string;
      's_589ee1': string;
      's_5bfbb7': string;
      's_5fbc63': string;
      's_70a8da': string;
      's_73ba7f': string;
      's_75dde0': string;
      's_785c45': string;
      's_7a1f3a': string;
      's_7b1758': string;
      's_7bf908': string;
      's_7c6eec': string;
      's_7ee992': string;
      's_818f94': string;
      's_8249e7': string;
      's_8332c9': string;
      's_872061': string;
      's_89bdbf': string;
      's_8c288d': string;
      's_8c8458': string;
      's_8d365a': string;
      's_8e8592': string;
      's_8fe3e8': string;
      's_9ad0cc': string;
      's_9db108': string;
      's_9fd2f3': string;
      's_a1e9f9': string;
      's_a2cb3c': string;
      's_a2f3a7': string;
      's_a3fb7a': string;
      's_a5d6a1': string;
      's_a62509': string;
      's_a9577d': string;
      's_a969aa': string;
      's_a97bcc': string;
      's_aaa399': string;
      's_b74c4e': string;
      's_c24cae': string;
      's_c50b8f': string;
      's_c5bb5d': string;
      's_c86934': string;
      's_c887b9': string;
      's_c9bc84': string;
      's_cd4fe8': string;
      's_ce7472': string;
      's_d08ccb': string;
      's_d15371': string;
      's_d178f4': string;
      's_d300d6': string;
      's_d5d3ea': string;
      's_d8481d': string;
      's_d887cc': string;
      's_e09921': string;
      's_e3b925': string;
      's_e56df8': string;
      's_e6e178': string;
      's_e7f7ee': string;
      's_e87389': string;
      's_ea763f': string;
      's_ec3c35': string;
      's_ee7b88': string;
      's_f04a9d': string;
      's_f59c46': string;
      's_f77be3': string;
      's_f90548': string;
      's_f907f8': string;
      's_fa3fc3': string;
      's_fe3f95': string;
    };
    googleReviewsModal: {
      's_0d75a8': string;
      's_273f6f': string;
      's_3ea133': string;
      's_6913b8': string;
      's_6a6eaf': string;
      's_6bce42': string;
      's_aaf427': string;
      's_ba9553': string;
      's_bd9554': string;
      's_c34ae8': string;
      's_cbac3e': string;
      's_d45c4f': string;
      's_d6f49f': string;
    };
    groceriesPage: {
      's_160a42': string;
      's_340a24': string;
      's_48028b': string;
      's_504097': string;
      's_7447ef': string;
      's_828ad2': string;
      's_a1e9f9': string;
      's_dcc1fb': string;
    };
    header: {
      's_64f892': string;
      's_7abd6c': string;
    };
    hero: {
      's_67300d': string;
      's_7ecda2': string;
      's_c75a68': string;
      's_ece6e2': string;
    };
    hostOnboarding: {
      's_00679c': string;
      's_013237': string;
      's_0302c0': string;
      's_0d3b1e': string;
      's_10599c': string;
      's_10a49a': string;
      's_120c32': string;
      's_12e078': string;
      's_1596ef': string;
      's_193de6': string;
      's_205866': string;
      's_20687f': string;
      's_25916d': string;
      's_25e7e1': string;
      's_272c68': string;
      's_292d45': string;
      's_2bbda0': string;
      's_33becf': string;
      's_369c34': string;
      's_3cc2c7': string;
      's_415e74': string;
      's_421a0f': string;
      's_486ffa': string;
      's_49e09b': string;
      's_4a9200': string;
      's_4e17c4': string;
      's_58eafa': string;
      's_616ace': string;
      's_62a764': string;
      's_6372ac': string;
      's_67745b': string;
      's_692b50': string;
      's_7013c7': string;
      's_75d65e': string;
      's_773613': string;
      's_782667': string;
      's_7af122': string;
      's_7b12e1': string;
      's_7bba35': string;
      's_810878': string;
      's_82c7e7': string;
      's_849305': string;
      's_86adcf': string;
      's_893bd7': string;
      's_897c71': string;
      's_8ad7ea': string;
      's_8dc8f7': string;
      's_8e3c7a': string;
      's_924da1': string;
      's_93cfd5': string;
      's_9550a5': string;
      's_99d32f': string;
      's_9d617c': string;
      's_a2a1b1': string;
      's_a68df4': string;
      's_a6d2ea': string;
      's_a8dc5c': string;
      's_aa1d9b': string;
      's_ae7f40': string;
      's_b45dc8': string;
      's_b501d3': string;
      's_b50578': string;
      's_b5508b': string;
      's_be3ecd': string;
      's_bf72f7': string;
      's_c0b7d7': string;
      's_c250a9': string;
      's_c36127': string;
      's_ca1948': string;
      's_ca9b4a': string;
      's_cde9a5': string;
      's_ce9840': string;
      's_d1d7c9': string;
      's_d90fdd': string;
      's_e400b7': string;
      's_e45952': string;
      's_e4cee9': string;
      's_e61a08': string;
      's_e9c696': string;
      's_eb7eb7': string;
      's_ecc61a': string;
      's_edbfdd': string;
      's_f0ac0a': string;
      's_f548ec': string;
      's_f71497': string;
      's_faea7e': string;
      's_fbd2e5': string;
      's_ff1835': string;
    };
    languageSwitcher: {
      's_03e64a': string;
      's_99547d': string;
      's_b8cc8e': string;
    };
    merchantAdCarousel: {
      's_297522': string;
      's_2d4e52': string;
      's_3340de': string;
      's_430fac': string;
    };
    merchantCard: {
      's_3beea0': string;
      's_960d55': string;
    };
    merchantItemModal: {
      's_062e79': string;
      's_6c02ab': string;
    };
    merchantOnboarding: {
      's_00b623': string;
      's_012a51': string;
      's_01edab': string;
      's_02aa9a': string;
      's_0bd62e': string;
      's_0cb1d6': string;
      's_108c09': string;
      's_197803': string;
      's_1c7169': string;
      's_1cf31b': string;
      's_20f7df': string;
      's_21f543': string;
      's_22691e': string;
      's_26a2ff': string;
      's_2eabdb': string;
      's_312631': string;
      's_39e42f': string;
      's_3e95c1': string;
      's_3fa081': string;
      's_411097': string;
      's_4331e0': string;
      's_4baf91': string;
      's_4f2047': string;
      's_540d0d': string;
      's_550c6f': string;
      's_5664e0': string;
      's_59c22e': string;
      's_5fa789': string;
      's_676418': string;
      's_67de19': string;
      's_7122f5': string;
      's_71c904': string;
      's_721462': string;
      's_7308b8': string;
      's_8242a9': string;
      's_85273b': string;
      's_869b48': string;
      's_87a51d': string;
      's_89ac4c': string;
      's_8c1404': string;
      's_91091f': string;
      's_91dd0b': string;
      's_928d67': string;
      's_9441e0': string;
      's_959d0c': string;
      's_963f97': string;
      's_9d4f8b': string;
      's_a03653': string;
      's_a0b2cf': string;
      's_a133eb': string;
      's_a4d472': string;
      's_a5d0ab': string;
      's_abf9f4': string;
      's_b03404': string;
      's_b32233': string;
      's_b62775': string;
      's_b639de': string;
      's_b8579d': string;
      's_b9084a': string;
      's_b9f2b1': string;
      's_b9ffbd': string;
      's_bb20e3': string;
      's_c05283': string;
      's_c5955e': string;
      's_c6846b': string;
      's_d1bf6b': string;
      's_d1d21f': string;
      's_d33bf6': string;
      's_d7a397': string;
      's_d890b7': string;
      's_db3b79': string;
      's_e0a26d': string;
      's_e58331': string;
      's_e79369': string;
      's_eab077': string;
      's_eab952': string;
      's_ebaf4a': string;
      's_ed6a3f': string;
      's_f1dd4c': string;
      's_f7c245': string;
      's_faea7e': string;
    };
    merchantPage: {
      's_c902a1': string;
    };
    merchantPreviewSheet: {
      's_0f4c5c': string;
      's_28da6e': string;
      's_baa550': string;
    };
    merchantRoute: {
      's_176135': string;
      's_a1ca54': string;
      's_e84712': string;
    };
    merchantView: {
      's_085b31': string;
      's_3fcbae': string;
      's_67300d': string;
    };
    metricsDashboard: {
      's_048f2f': string;
      's_0dd383': string;
      's_1c8836': string;
      's_235f7b': string;
      's_236a59': string;
      's_266384': string;
      's_406acb': string;
      's_41e8de': string;
      's_461aff': string;
      's_58b6dc': string;
      's_5dd968': string;
      's_65916f': string;
      's_74d595': string;
      's_74efa0': string;
      's_75e157': string;
      's_8474ec': string;
      's_886fb2': string;
      's_9d5b00': string;
      's_a41501': string;
      's_b0ad50': string;
      's_c347b1': string;
      's_cc1e6a': string;
      's_cec477': string;
      's_e4076f': string;
      's_ee9d59': string;
      's_f8fd6e': string;
      's_ffb77d': string;
    };
    nexGCategoryDrilldown: {
      's_03f70c': string;
      's_09efe8': string;
      's_0df6f0': string;
      's_0ecb20': string;
      's_126f44': string;
      's_19ad69': string;
      's_1b8543': string;
      's_1f647f': string;
      's_27c636': string;
      's_2994b4': string;
      's_2c9e5a': string;
      's_2f1873': string;
      's_34318e': string;
      's_492026': string;
      's_4ce3f0': string;
      's_50238f': string;
      's_543b1b': string;
      's_5be698': string;
      's_77bf79': string;
      's_7db318': string;
      's_8978ea': string;
      's_8bf67b': string;
      's_9dca31': string;
      's_ab2d11': string;
      's_c07c6d': string;
      's_c14e04': string;
      's_c25b51': string;
      's_d394a9': string;
      's_e16a1d': string;
      's_eb13c4': string;
      's_fae58c': string;
      's_fcdcf7': string;
    };
    nexGCollectionRail: {
      's_0b3917': string;
      's_2994b4': string;
      's_2c9e5a': string;
      's_986032': string;
    };
    nexGDiscoveryView: {
      's_6d9483': string;
      's_741311': string;
      's_76cb8c': string;
      's_844b94': string;
      's_8f8796': string;
      's_a9176a': string;
      's_b0a3fc': string;
      's_df4cf6': string;
    };
    nexGEntityCard: {
      's_085ed0': string;
    };
    nexGItemSheet: {
      's_0932f6': string;
      's_22b77f': string;
      's_24a16c': string;
      's_3beea0': string;
      's_65d22e': string;
      's_68f2d8': string;
      's_693039': string;
      's_a99ee2': string;
      's_c6cf76': string;
      's_d0e359': string;
      's_eeea54': string;
    };
    nexGLandingHero: {
      's_0b8149': string;
      's_2bd100': string;
      's_381d79': string;
      's_52a6f3': string;
      's_71a30d': string;
      's_e17357': string;
      's_f7c400': string;
      's_fa918a': string;
    };
    nexGSearchEngine: {
      's_c5b914': string;
      's_cd81f4': string;
    };
    offercarousel: {
      's_10bb09': string;
      's_2aa5dc': string;
      's_7141bc': string;
    };
    orderTrackingModal: {
      's_116632': string;
      's_375813': string;
      's_43301e': string;
      's_536456': string;
      's_61243a': string;
      's_6e6109': string;
      's_74e226': string;
      's_84e3ee': string;
      's_976a74': string;
      's_9c12c6': string;
      's_9ca905': string;
      's_9fb5a8': string;
      's_a392ce': string;
      's_b868ce': string;
      's_cbac3e': string;
      's_cd1876': string;
      's_d6e963': string;
      's_ea2152': string;
      's_f56564': string;
    };
    productcarousel: {
      's_10bb09': string;
      's_7141bc': string;
    };
    promo: {
      's_38769a': string;
      's_4a421c': string;
      's_c63982': string;
      's_d2c984': string;
    };
    restaurantDetailModal: {
      's_034ad6': string;
      's_116c19': string;
      's_3beea0': string;
      's_4f2130': string;
      's_52aed7': string;
      's_56ba29': string;
      's_649ff9': string;
      's_652bc8': string;
      's_79db72': string;
      's_79fe15': string;
      's_9c203d': string;
      's_9f068b': string;
      's_a023e6': string;
      's_b05630': string;
      's_b38795': string;
      's_c152be': string;
      's_e1c6bf': string;
      's_f4657b': string;
    };
    restaurants: {
      's_0721cf': string;
      's_072c89': string;
      's_0c8f01': string;
      's_25b120': string;
      's_2c3b25': string;
      's_34df71': string;
      's_4f9fa0': string;
      's_5be698': string;
      's_5f716b': string;
      's_6b2c05': string;
      's_7288fd': string;
      's_868fb0': string;
      's_99256e': string;
      's_9da221': string;
      's_a1e9f9': string;
      's_ae0cb2': string;
      's_bf0c7d': string;
      's_cfdf8b': string;
      's_d97dd5': string;
      's_dde236': string;
      's_e25e77': string;
      's_eac205': string;
    };
    routeFallback: {
      's_1c5772': string;
    };
    scrollToTop: {
      's_f07710': string;
    };
    spaBookingModal: {
      's_039d05': string;
      's_09121f': string;
      's_15ddf4': string;
      's_17548b': string;
      's_2fd731': string;
      's_301d19': string;
      's_4548b7': string;
      's_485336': string;
      's_4b8ec9': string;
      's_5621b9': string;
      's_712231': string;
      's_7d1e9d': string;
      's_8cff8d': string;
      's_9092d9': string;
      's_9505aa': string;
      's_950d86': string;
      's_9a36a0': string;
      's_9e603c': string;
      's_a027ba': string;
      's_b3a5a1': string;
      's_be9475': string;
      's_c0a672': string;
      's_c8c5fe': string;
      's_f00e02': string;
      's_f79d9c': string;
    };
    spaWellness: {
      's_120405': string;
      's_3669be': string;
      's_5276ac': string;
      's_5dfb4e': string;
      's_659a92': string;
      's_689bea': string;
      's_69d23c': string;
      's_9aabe9': string;
      's_a1e9f9': string;
      's_c1c2fb': string;
      's_d02cb4': string;
      's_eb9e1e': string;
      's_f212ea': string;
      's_f2937f': string;
      's_fda6e0': string;
      's_fe0476': string;
    };
    stats: {
      's_034abd': string;
      's_826dd3': string;
      's_bd3fa2': string;
      's_dc04b9': string;
      's_e819e6': string;
      's_f2a377': string;
    };
    transportBookingModal: {
      's_1505c5': string;
      's_160ad9': string;
      's_251e18': string;
      's_314bee': string;
      's_358b66': string;
      's_36a60c': string;
      's_39b21c': string;
      's_457b66': string;
      's_6f672b': string;
      's_77ae94': string;
      's_7a4175': string;
      's_8941e9': string;
      's_8dea76': string;
      's_99d1c7': string;
      's_9ca1bd': string;
      's_a1cbc4': string;
      's_b68827': string;
      's_be057d': string;
      's_cd11b4': string;
      's_d0cd2d': string;
      's_efb6c4': string;
      's_f2f922': string;
    };
    transportPage: {
      's_1836d5': string;
      's_1afb28': string;
      's_2ea911': string;
      's_3390d4': string;
      's_3727e7': string;
      's_52b224': string;
      's_543b1b': string;
      's_784e6e': string;
      's_875bd6': string;
      's_898adc': string;
      's_93f4b8': string;
      's_a1e9f9': string;
      's_eac49e': string;
      's_eb9e1e': string;
    };
    unifiedItemModal: {
      's_0125ec': string;
      's_1cc3d0': string;
      's_3c0047': string;
      's_4c13f0': string;
      's_5d14d6': string;
      's_94c578': string;
      's_a027ba': string;
      's_bf3b18': string;
      's_ee3e2e': string;
      's_ee749a': string;
    };
  };


  /*
    SHARED FORM VOCABULARY.

    These are the strings that appear on more than one form — an email label on four onboarding
    flows, "Save draft" on three. Extracting them means a later component references a key that
    already exists rather than adding a fifty-first way to say "Full name".

    Scoped deliberately: it holds what is genuinely common and nothing else. Form-specific copy
    ("Driver's License Expiry Date", "E.g. KMCA 123A") stays with its own screen, because
    collecting one-off strings into a shared block is how a shared block becomes unmaintainable.

    Placeholders use {braces} where a value is substituted. See forms.stepOf.
  */
  forms: {
    actionSave: string;
    actionSaveDraft: string;
    actionContinue: string;
    actionBack: string;
    actionNext: string;
    actionCancel: string;
    actionConfirm: string;
    actionSubmit: string;
    actionReview: string;
    actionEdit: string;
    actionRemove: string;
    actionUpload: string;
    actionTryAgain: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    whatsappNumber: string;
    nationalId: string;
    dateOfBirth: string;
    county: string;
    addressStreet: string;
    areaNeighbourhood: string;
    preferredContact: string;
    documentType: string;
    documentUpload: string;
    documentExpiry: string;
    businessRegistration: string;
    taxPin: string;
    certificateOfIncorporation: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchName: string;
    mobileMoneyNumber: string;
    paymentMethod: string;
    chooseDate: string;
    chooseOption: string;
    selectYourRole: string;
    yes: string;
    no: string;
    optional: string;
    required: string;
    thisFieldRequired: string;
    enterValidEmail: string;
    enterValidPhone: string;
    selectOneOption: string;
    uploadRequired: string;
    stepOf: string;
    unsavedChanges: string;
    placeholderFullName: string;
    placeholderEmail: string;
    placeholderPhoneKe: string;
    placeholderExample: string;
  };

  nav: {
    home: string;
    explore: string;
    restaurants: string;
    spa: string;
    spaDistrict: string;
    transport: string;
    groceries: string;
    experiences: string;
    partners: string;
    forProperties: string;
    forCouriers: string;
    forMerchants: string;
    partnerOnboarding: string;
    applyFleet: string;
    listBusiness: string;
    track: string;
    viewCart: string;
    appearanceMode: string;
    lightMode: string;
    darkMode: string;
    selectLanguage: string;
    menu: string;
    close: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    searchPlaceholder: string;
    searchBtn: string;
    popular: string;
    sugMichelin: string;
    sugMassage: string;
    sugMaybach: string;
    sugCaviar: string;
    sugYacht: string;
    btnFineDining: string;
    btnSpa: string;
    btnMobility: string;
    ambienceDaylight: string;
    ambienceTwilight: string;
  };
  categories: {
    heading: string;
    subtitle: string;
    groceriesTitle: string;
    groceriesDesc: string;
    transportTitle: string;
    transportDesc: string;
    spaTitle: string;
    spaDesc: string;
    restaurantsTitle: string;
    restaurantsDesc: string;
    experiencesTitle: string;
    experiencesDesc: string;
    essentialsTitle: string;
    essentialsDesc: string;
    viewAll: string;
  };
  howItWorks: {
    badge: string;
    heading: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  promo: {
    badge: string;
    heading: string;
    desc: string;
    cta: string;
    code: string;
    appHeading1: string;
    appHeading2: string;
    appSubtitle: string;
    downloadOn: string;
    appStore: string;
    getItOn: string;
    googlePlay: string;
    merchantsTitle: string;
    merchantsDesc: string;
    merchantsCta: string;
    couriersTitle: string;
    couriersDesc: string;
    couriersCta: string;
    propertiesTitle: string;
    propertiesDesc: string;
    propertiesCta: string;
  };
  features: {
    badge: string;
    heading: string;
    subtitle: string;
    feat1Title: string;
    feat1Desc: string;
    feat2Title: string;
    feat2Desc: string;
    feat3Title: string;
    feat3Desc: string;
    feat4Title: string;
    feat4Desc: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
  };
  restaurants: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    filterJapanese: string;
    filterItalian: string;
    filterFrench: string;
    filterMediterranean: string;
    filterSteakhouse: string;
    filterDesserts: string;
    viewMenu: string;
    minOrder: string;
    deliveryTime: string;
    featuredDish: string;
    addToBag: string;
    closed: string;
    openNow: string;
  };
  spa: {
    title: string;
    subtitle: string;
    bookTreatment: string;
    duration: string;
    inVilla: string;
    sanctuary: string;
    therapistGender: string;
    anyTherapist: string;
    femaleTherapist: string;
    maleTherapist: string;
    reserveNow: string;
  };
  transport: {
    title: string;
    subtitle: string;
    chauffeurIncluded: string;
    perHour: string;
    airportTransfer: string;
    bookChauffeur: string;
    capacity: string;
    luggage: string;
    instantDispatch: string;
  };
  groceries: {
    title: string;
    subtitle: string;
    cellar: string;
    pantry: string;
    caviar: string;
    bakery: string;
    addToCart: string;
    inStock: string;
  };
  experiences: {
    title: string;
    subtitle: string;
    bookExperience: string;
    groupSize: string;
    duration: string;
    vipHostIncluded: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    exploreBtn: string;
    subtotal: string;
    deliveryFee: string;
    conciergeService: string;
    total: string;
    checkoutBtn: string;
    villaPlaceholder: string;
    specialNotes: string;
    orderPlaced: string;
    items: string;
    clearCart: string;
  };
  tracking: {
    title: string;
    orderNumber: string;
    estimatedArrival: string;
    mins: string;
    statusConfirmed: string;
    statusPreparing: string;
    statusInTransit: string;
    statusDelivered: string;
    courierAssigned: string;
    contactConcierge: string;
    close: string;
  };
  footer: {
    brandDesc: string;
    exploreTitle: string;
    partnersTitle: string;
    legalTitle: string;
    privacy: string;
    terms: string;
    cookies: string;
    rightsReserved: string;
    language: string;
    craftedWith: string;
    aboutText: string;
    verticals: string;
    fineDining: string;
    spaWellness: string;
    vipMobility: string;
    gourmetCellar: string;
    experiences: string;
    partners: string;
    forMerchants: string;
    forCouriers: string;
    forProperties: string;
    legalSupport: string;
    conciergeDesk: string;
    termsOfService: string;
    privacyPolicy: string;
    safetyStandards: string;
    connect: string;
    rights: string;
    simulatedNotice: string;
  };
  partnerHeaders: {
    ecosystem: string;
    qrTech: string;
    revShareCalc: string;
    integrations: string;
    benefits: string;
    logistics: string;
    howItWorks: string;
    categories: string;
    earningsCalc: string;
    fleetPerks: string;
    standards: string;
    faq: string;
  };
  partnersPortal: {
    merchantTitle: string;
    merchantSubtitle: string;
    courierTitle: string;
    courierSubtitle: string;
    propertiesTitle: string;
    propertiesSubtitle: string;
    backHome: string;
    listBusiness: string;
    applyFleet: string;
    partnerNexg: string;
    onboardingActive: string;
    onboardingStatus: string;
    stepText: string;
    ofText: string;
    nextStep: string;
    prevStep: string;
    submitApplication: string;
    agreementTitle: string;
    agreementDesc: string;
    successTitle: string;
    successDesc: string;
    returnHome: string;
    downloadSummary: string;
    riderPortal: string;
    eastAfricaSecure: string;
    backToSite: string;
    activeStatus: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
  ui: {
    bookingCalendar: {
      's_07499a': 'Party / Guests',
      's_10422c': 'Local Villa Time',
      's_183a37': 'Sync Calendar',
      's_534c34': 'Next Month',
      's_71b856': 'Previous Month',
      's_79caea': 'Available Time Slots',
      's_8efff8': 'In 2 Days',
      's_aeb91b': 'Dedicated Reservation Calendar',
      's_e5366b': 'Selected Schedule',
      's_fdc2b8': 'Next Week',
    },
    cartDrawer: {
      's_11a9f0': 'Explore Menus',
      's_1fc724': 'Promo code (try NEXG20)',
      's_2303a3': 'Your cart is empty',
      's_237e47': 'Clear entire cart',
      's_2c7952': 'Simulated checkout & instant confirmation',
      's_42cb61': 'Close cart',
      's_44951e': 'Courier tip',
      's_643b96': 'Your Order Cart',
      's_733b61': 'Delivery fee',
      's_76ecba': 'Remove item',
      's_ab8546': 'Explore our curated restaurants and add artisanal dishes or concierge dining to get started.',
      's_c7085d': 'Courier Concierge Tip',
      's_d2467b': 'Your order',
      's_d2f4d4': 'Proceed to Checkout',
      's_d6ea26': 'Concierge service fee',
    },
    categories: {
      's_1a9863': 'Browse Partners',
    },
    categoryExplorerModal: {
      's_233e38': 'Click any category or subcategory to instantly browse partners',
      's_7c267a': 'View listings',
      's_7fd08b': 'Reset Catalog Filters',
      's_940323': 'Close categories',
      's_af1c10': 'Verified Merchant Partners',
      's_c7fa37': 'Try searching for another keyword or clear the search query.',
      's_c9f43c': 'Search across all 21 categories & 134 subcategories (e.g. Fine Dining, Vapes, Chauffeur, Safari)...',
      's_e37ac9': 'No matching verticals found',
      's_f4cf7c': 'Merchant Categories & Subcategories',
    },
    categoryPage: {
      's_004d7e': 'Top Rated',
      's_062888': 'Free Delivery',
      's_2cef94': 'Reset all filters',
      's_41eb8f': 'Fastest Delivery',
      's_c4baea': 'Price Level',
      's_fce284': 'No merchants found matching your filters.',
    },
    checkoutSimulatedModal: {
      's_119c2f': 'This payment is',
      's_19e2a2': 'Finalize & Place Order',
      's_3a7a99': 'Apple Pay',
      's_55e54d': 'App Delivery Instructions',
      's_635949': 'Choose Simulated Payment Method',
      's_63da07': 'Simulate Payment & Place Order',
      's_6aa79c': 'Selected Items',
      's_7db213': 'Hotel / Villa / Street Address',
      's_846466': 'Close checkout',
      's_882f46': 'Simulates instant STK push prompt directly on mobile handset.',
      's_9ad55a': 'Total Demo Amount',
      's_ac51d0': 'Cardholder Name',
      's_b79126': 'No real funds or accounts will be debited.',
      's_bac774': 'Simulated Demo Checkout',
      's_bb36a9': 'DEMO ROUTER',
      's_cecb67': 'Preloaded Demo Card',
      's_dd0a60': 'Router Demo Validated',
      's_e5297b': 'Delivery Address & Location',
      's_e569ab': 'Processing Demo Payment...',
      's_ea3289': 'Room Folio / Cash',
      's_ea4478': 'Simulates one-touch FaceID / TouchID authorization.',
      's_eb034a': 'Billed directly to your hotel master room folio upon delivery.',
      's_ee343f': 'Sandbox Router Active',
      's_fee23b': 'Merchant Partner',
    },
    consentBanner: {
      's_35c291': 'Reject all',
      's_66cd82': 'Strictly necessary cookies keep the site working. Analytics and marketing cookies stay off until you turn them on, and you can change this at any time.',
      's_788df5': 'Your cookie choices',
      's_821d1f': 'Accept all',
      's_956fa7': 'Save choices',
      's_9e0cba': 'Cookie settings',
      's_da6a92': 'Necessary cookies are always active. Everything else is optional.',
      's_e7d306': 'Cookie preferences',
      's_f477c8': 'Always on. It cannot be switched off because the site cannot run without it.',
    },
    courierOnboarding: {
      's_037e0b': 'Our compliance officers verify your submitted National ID, license, PIN, and fleet logbooks directly against NTSA registers.',
      's_03c52e': 'Guaranteed Base Salary',
      's_06c8b6': 'Verify your registered logistics enterprise. Only PDF files and scanned images up to 5MB size are accepted.',
      's_0b39f6': 'Fleet Partner',
      's_0bd62e': 'Account Number',
      's_0cb44f': 'Executive Sedan / Van',
      's_0d36d5': 'Active public third-party or comprehensive fleet cover policy certificate.',
      's_0d98d0': 'E.g. Swift Deliveries',
      's_0e3256': 'Submit official identification and transit licensing details.',
      's_0f32ec': 'Rider Record Card',
      's_1081b3': 'Full Name, Phone, ID Number, License Number, Vehicle Type, Plate Number',
      's_10f420': 'Shift & Operating Zones',
      's_14bf35': 'Ride custom NEXG-branded premium logistics vehicles, operate consistent shifts, and enjoy a stable guaranteed base salary.',
      's_156177': 'Certificate of Incorporation',
      's_17b238': 'Accepted For Fleet Provider',
      's_1805c7': 'This agreement begins immediately on approval and is valid for a period of 12 months. Either party may terminate with 7 days\' written notice, or NEXG may block platform access instantly in cases of safety breach, driving license revocation, or fraudulent behavior.',
      's_197646': 'Full Legal Name',
      's_204be3': 'E.g. operations@swiftlogistics.co.ke',
      's_2358e6': 'Independent Rider',
      's_24813d': 'E.g. Kileleshwa, Block D',
      's_26712f': 'Authorized Primary Contact Person',
      's_27538f': 'Outline your company’s transit capacities and target operating logistics zones.',
      's_27980f': 'WhatsApp Mobile Number',
      's_27c646': 'Company Office Headquarters',
      's_2952ca': 'Type Signature',
      's_2b31a3': 'E.g. A001234567Z',
      's_2cb0d8': 'Accepted & Agreed by Rider',
      's_2d6ca0': 'Vehicle Type',
      's_2dc8f1': 'E.g. Corner House, 4th Floor, Kimathi St.',
      's_2ed783': 'Return to Elite Fleet page',
      's_30b928': 'Company KRA PIN Certificate',
      's_310c80': 'Back to Couriers',
      's_312631': 'Bank Name',
      's_3174a5': 'Contact Email Address',
      's_31843b': 'Clear canvas',
      's_338cf2': 'Services & Settlement Payout',
      's_340115': 'Clear scanned copy of front and back face of your card.',
      's_34e784': 'E.g. Swift Express Logistics Ltd',
      's_34f9ae': 'Certificate of Incorporation / Reg No.',
      's_377b90': 'Authorized Dispatch Committee',
      's_37dfba': 'NTSA Driver\'s License Number',
      's_3873df': 'E.g. DL-XXXXXX',
      's_3af714': 'No active couriers added yet',
      's_3ba957': 'E.g. Nairobi',
      's_3bfd88': 'KRA PIN Number',
      's_3c3541': 'Consolidated Business payout',
      's_3c774b': 'Carry VIP guests to properties',
      's_3cc4fd': 'NEXG Provides Vehicle',
      's_3ce5aa': 'Emergency Contact Person',
      's_41d914': 'Choose the expiry date',
      's_41fe24': 'Draw digital signature with finger or pointer',
      's_430404': 'Remove Card',
      's_44fe57': 'Emergency Mobile Phone',
      's_464dfd': 'We declare absolute compliance with Kenyan corporate regulations, active tax filings, and legal road safety acts.',
      's_4979be': 'We certify that all couriers listed in our squad profiles hold valid, unexpired NTSA driving licenses and clean background clearance certifications.',
      's_4c7486': 'Corporate Job Title',
      's_4c987a': 'Authorized Officer Full Name',
      's_4d1c2f': 'Structured Shift schedules',
      's_4ff862': 'E.g. 4',
      's_50d865': 'Upload crisp clear photo snapshots or PDF files under 5MB size limit.',
      's_5104d5': 'Preferred Operating Area Zone',
      's_51dacf': 'WhatsApp Number',
      's_53d718': 'The Fleet Provider represents and warrants that all couriers and motorbikes comply with roadworthy rules, hold comprehensive insurance certifications, and observe Kenya\'s Data Protection Act 2019 standards.',
      's_55537f': 'Vehicle Registration details',
      's_574f02': 'Next Step',
      's_587649': 'Official KRA Pin certification document page from iTax portal.',
      's_5920ae': 'You are applying for a scheduled, salaried position. NEXG provides custom branded bikes, gear, and fuel budgets. Below, you will also designate your operational preferences.',
      's_5a833b': 'Residential Address',
      's_5b5250': 'Fleet Partner Business Profile',
      's_5cfa43': 'NTSA Driving License',
      's_5f5518': 'Drive your own motorcycle or scooter, set your flexible calendar hours, and take commissions per successfully completed errand.',
      's_63a113': 'Total Registered Vehicles',
      's_64346b': 'Full Name',
      's_6790f2': 'Corporate Bank Name',
      's_692fe8': 'E.g. P051234567Z',
      's_6b3d6a': 'Deliver premium retail items',
      's_6f9c91': 'E.g. +254 711...',
      's_70abeb': 'Bank Settlement Transfer',
      's_714406': 'Configure your legal registered business details for logistics partnerships.',
      's_717eb1': 'Company Account Title',
      's_71c904': 'NEXG APP LIMITED',
      's_71ebbb': 'E.g. Red Honda CB125F (Year 2023)',
      's_71f6e3': 'Register Active Couriers Squad',
      's_72a587': 'Board Operations Committee',
      's_74955f': 'E.g. Westlands',
      's_76af1d': 'E.g. 15',
      's_77522e': 'NEXT STEPS IN OUR VERIFICATION TIMELINE',
      's_79865b': 'Preferred Working Shift',
      's_7cf2e1': 'Alternative Contact Phone',
      's_7d5f6e': 'Unlock premier delivery earnings, tailored branding, and unmatched support in Kenya’s luxury hospitality ecosystem.',
      's_7d8667': 'Plate Number',
      's_81db77': 'Years in Logistics Sector',
      's_827c49': 'Account Holder Legal Name',
      's_828ade': 'Vip App',
      's_831dc7': 'KRA PIN Confirmation Certificate',
      's_86d4ca': 'For NEXG App',
      's_8bb6da': 'E.g. 12345678',
      's_8d5d4c': 'Company Business Verification Documents',
      's_8e203d': 'Handle high-end guest requests',
      's_8f912f': 'E.g. CPR/2018/12345',
      's_903d8d': 'Execute Partnership Agreement Contract',
      's_913798': 'Click Add Rider Card above or upload your riders spreadsheet via CSV bulk import.',
      's_93457d': 'Fleet Operational Scale & Coverage',
      's_93e220': 'Corporate Fleet Partner logistics Framework',
      's_9691d0': 'ONBOARDING PROFILE SUMMARY',
      's_984805': 'Operating Counties & Estates Coverage',
      's_99dc14': 'Pending Compliance Review',
      's_9d159c': 'Direct Mobile Number',
      's_a0094a': 'Payout Method',
      's_a1524d': 'E.g. 12001234567',
      's_a1c4fe': 'E.g. +254 700 111 222',
      's_a221a1': 'Upon document clearance, you\'ll receive a WhatsApp invitation to join our premium standard customer service and hospitality training.',
      's_a40d60': 'Premium Commission Payout',
      's_a620a5': 'Official business registration certificate page issued by the Registrar of Companies.',
      's_a7c94e': 'NEXG agrees to compile and settle client order payments to the Fleet Provider’s registered bank account weekly on Mondays, less a platform operations commission fee of',
      's_a85feb': 'Your premium motorbike is provided by NEXG. You do not need to register a personal motorbike logbook or license plate here.',
      's_a8caa4': 'Add individual active riders to your partnership ledger.',
      's_aafa84': 'Active Vehicle types represented in Fleet',
      's_ac26fd': 'Submit Portfolio Agreement',
      's_ad7df6': 'Motorcycle / Scooter',
      's_aed4fc': 'Join the Elite NEXG Rider Fleet',
      's_aef6a9': 'National ID / Passport Number',
      's_af7bb7': 'Signatory Director\'s National ID',
      's_af8a4e': 'The Fleet Provider certifies that they actively manage and pay a squad of',
      's_b026ba': 'City HQ Location',
      's_b09e88': 'Draw Signature',
      's_b21f30': 'ID Number',
      's_b2e0a8': 'Driver\'s License Expiry Date *',
      's_b5015c': 'List all cities and estates where your fleet currently has active coverage. E.g. Nairobi CBD, Westlands, Kilimani, Mombasa, Diani, etc.',
      's_b5c479': 'NEXG Dedicated Rider',
      's_b724e7': 'Print Agreement Document',
      's_b984fa': 'Import CSV Spreadsheet',
      's_b9d00c': 'This contract is binding for a term of 12 months. Either partner may exit the frame by providing 14 days\' written notice to the other party.',
      's_bc5303': 'Add Rider Card',
      's_bf24cb': 'Name exactly as printed on legal ID card',
      's_c1ecb3': 'Package Delivery',
      's_c33c9b': 'DL Number',
      's_c59900': 'E.g. KMCA 123A',
      's_c7a051': 'We declare that our organization maintains comprehensive third-party logistics insurance and active public liability coverage across all active fleet operators.',
      's_c85d99': 'Proof of ownership and active public transit insurance coverage.',
      's_c8708a': 'Company Legal Name',
      's_c8bc71': 'Corporate Bank Settlement Account',
      's_c8ed49': 'Identification & Vehicle Setup',
      's_ca5690': 'Download Standard CSV Template',
      's_cabacd': 'NEXG Operations Admin',
      's_cdec1f': 'Both sides of your active, unexpired logistics driver license.',
      's_d101b7': 'Onboard your registered Kenyan logistics agency and entire courier squad. Bulk upload riders and manage team-level settlements.',
      's_d5184b': 'Own Vehicle required',
      's_d5e54c': 'Commercial Fleet Insurance Policy',
      's_d64903': 'NEXG remits compiled client transport payout settlements directly to your corporate account weekly on Mondays.',
      's_d66864': 'Flexible Shifts',
      's_d9863a': 'E.g. Fleet Manager',
      's_db3b79': 'Account Name',
      's_dca3fc': 'E.g. Westlands, Kilimani, Lavington',
      's_ddb4d1': 'E.g. Equity Bank',
      's_de744b': 'E.g. Mary Jane',
      's_e04a0d': 'Payout Settlement Configurations',
      's_e07446': 'Review pre-filled contract agreement clauses and apply your electronic signature.',
      's_e0934e': 'Date of Birth *',
      's_e12ee9': 'Preferred Transit Vehicle Assigned',
      's_e15c6c': 'Trading Name / Brand Name',
      's_e16a80': 'Document Verification Uploads',
      's_e1c6ae': 'Bulk CSV Squad Import',
      's_e1fe05': 'E.g. Albert Mwangi',
      's_e21ec5': 'Vehicle Model & Color',
      's_e387b2': 'Business KRA PIN',
      's_e3ca9b': 'E.g. John Kamau Maina',
      's_e4c574': 'E.g. +254 711 000 000',
      's_e7710e': 'Typed Electronic Signature preview',
      's_e7cfff': 'Authorized Signature Panel',
      's_e90701': 'Select Gender',
      's_eb6915': 'Fleet Integrity Declarations',
      's_ec9a3f': 'Estate Area / Street',
      's_ecd675': 'Vehicle Logbook & Third-Party Insurance',
      's_eeec98': 'Import CSV',
      's_ef8482': 'Choose Your Partnership model',
      's_efbb4c': 'E.g. Spouse / Parent',
      's_f3a211': 'E.g. +254 700 987 654',
      's_f4afb4': 'Choose your date of birth',
      's_f65568': 'E.g. +254 712 345 678',
      's_f6da6f': 'Personal Profile Details',
      's_f71ebc': 'E.g. John Kamau',
      's_f954ab': 'NEXG Fleet Operations',
      's_f9f8d5': 'Select the model that aligns with your assets. We have personalized contracts and onboarding checklist steps for each path.',
      's_fa0cdb': 'Total Active Riders',
      's_fbbe43': 'Configure how you receive settlements and who to contact in emergencies.',
      's_fca1ec': 'Ensure your details correspond exactly with your National Identification Document.',
      's_feb1b4': 'ID of the legal officer executing the Fleet Partnership Agreement.',
      's_febf86': 'Rider agrees to strictly wear the customized NEXG apparel on duty, maintain exemplary clean vehicle hygiene, arrive within specified time slots, and respect international hospitality guests\' absolute privacy. Failure to maintain a minimum 4.0/5.0 star rating may result in temporary profile deactivation.',
    },
    curatedNairobiWorlds: {
      's_15a714': 'Dynamic cross-category plans tailored to your moment, occasion & time of day',
      's_18a51d': 'Full Experience Builder',
      's_41dd82': 'Curated Nairobi Worlds',
      's_52c035': 'NEXG Experience Orchestrator',
      's_8abe87': 'Explore Offerings in Main Feed',
      's_c2018d': 'Contextual Experience Hub',
      's_ecc198': 'Click step to explore offerings',
      's_fe8da0': 'Nairobi Curated',
    },
    databaseSqlModal: {
      's_baaf3a': 'PostgreSQL Database Scripts',
    },
    dateTimeField: {
      's_46a299': 'Previous month',
      's_7ecc8b': 'Choose a year',
      's_8abf7c': 'Next month',
    },
    discoveryScreen: {
      's_030851': 'Merchant categories',
      's_0b7ee2': 'All verticals',
      's_176135': 'The API may not be running. Start it with',
      's_412226': 'Clear filters',
      's_67300d': 'Clear search',
      's_8344a6': 'Search merchants',
      's_a3c57f': 'No merchants found',
      's_dfe60c': 'Load more',
      's_f4d948': 'Search restaurants, spa, safaris, champagne, chauffeur, pharmacy...',
    },
    dishCustomizerModal: {
      's_052b34': 'Guest Satisfaction',
      's_062e79': 'Increase quantity',
      's_1c711d': 'Verified Diners Only',
      's_2db328': 'Any preferences? e.g. Extra dressing on side, cutlery needed...',
      's_492026': 'Add to Order',
      's_594a3d': 'Share what made this dish memorable...',
      's_6c02ab': 'Decrease quantity',
      's_70d3a5': 'Close modal',
      's_84ab4b': 'Submit Verified Review',
      's_9c0406': 'Suite / Villa (e.g. Penthouse 402)',
      's_a196bb': 'Customize & Options',
      's_bfae0e': 'Your Name (e.g. Eleanor V.)',
      's_d0fac0': 'Leave Your Dining Review',
      's_ece1f0': 'Special Kitchen Instructions',
    },
    dockedSearchBar: {
      's_67300d': 'Clear search',
    },
    experiences: {
      's_057742': 'Curated Experience Hosts & Outfitters',
      's_14c995': 'Book Date',
      's_574a76': 'Book Activity',
      's_63ae7c': 'Date & Time',
      's_6568e5': 'Your booking with',
      's_96ebfb': 'Search hosts, Maasai Mara, Giraffe Centre, cinema, safari...',
      's_9fda6b': 'Back to all Outfitters',
      's_a1e9f9': 'Explore Home',
      's_ad3a34': 'Private Safaris, Aerial Tours & Cultural Ateliers',
      's_cebc44': 'Choose an expert outfitter to browse hot-air balloon flights over the Mara, private giraffe conservation sanctuaries, and master artisan ateliers.',
      's_d29299': 'Bespoke Concierge Expeditions',
      's_eb9e1e': 'Confirm Booking',
      's_f6e8ce': 'Experience Reservation',
    },
    floatingCartBar: {
      's_f40d71': 'View Order',
    },
    forCouriers: {
      's_06816c': 'Apply to Drive',
      's_08c1c3': 'We provide access to high-quality vehicle maintenance programs, comprehensive courier insurance plans, and dedicated dispatch teams assisting you 24/7.',
      's_0c343a': 'Apply Online',
      's_0c8a9a': 'Terms of Service',
      's_0e840b': 'Pocket High Tips',
      's_110158': 'Help Center',
      's_153ab5': 'Idle Reduction',
      's_18414d': 'Elite Fleet',
      's_1bedd8': 'Ambassadors utilizing our suite-specific integrated routing enjoy significantly higher success ratings and earn double the average industry tips.',
      's_1d2be9': 'Safety Guidelines',
      's_209f63': 'Average Earnings Growth',
      's_22d1d3': 'Once you submit your application online, our onboarding team reviews documents within 48 hours. If qualified, you\'ll be invited for a brief physical assessment and standard white-glove training before your account goes active.',
      's_2a7274': 'Submit your vehicle registration and documents online in under 5 minutes through our secure, mobile-friendly onboarding portal.',
      's_2bf27f': 'STEP 01',
      's_2d816d': 'Career Advancement',
      's_2e6151': 'FLEET REQUIREMENTS',
      's_2ed1ed': 'Premium Payouts for Professional Ambassadors.',
      's_33b4c6': 'Join the Elite Fleet',
      's_3500ab': 'Join a community built on premium status and mutual respect. We support your career path and help you develop unmatched service skills.',
      's_355ac2': 'Deliveries per Day',
      's_38769a': 'For Properties',
      's_38df83': 'Estimate Earnings',
      's_39bc68': 'Your Vehicle Type',
      's_41493f': 'Join the Elite',
      's_42475b': 'Maintain exceptional ratings and receive daily performance multipliers and exclusive priority dispatcher pairing.',
      's_440245': 'The NEXG Driver App',
      's_45b640': 'Go online in the driver app, navigate to hot premium spots, complete high-end orders, and watch your mobile wallet balance swell.',
      's_4748c1': 'Receive clear, automated settlements straight to your bank or mobile wallet without delay, backed by detailed electronic statements.',
      's_4c36e1': 'SETUP TIMELINE',
      's_4d5b64': 'Ambassador Rating',
      's_4d81b2': 'STEP 03',
      's_4f555f': 'Track your daily performance, optimize your delivery times, and master Swahili & English hospitality tips with our smart companion analytics dashboard.',
      's_5150fd': 'Priority Routing Tech',
      's_52a6f3': 'For Partners',
      's_530246': 'Guaranteed Weekly Payouts',
      's_53cdfb': 'DATA INTELLIGENCE',
      's_54c4b5': 'Exceptional Presentation',
      's_5b8964': 'Guest Rating Profiles',
      's_5ce9fd': 'Fast Verification',
      's_5e7925': 'Our professional partner compliance team validates your records and issues a secure orientation invitation within 48 hours.',
      's_653ccb': 'We currently support major high-end neighborhoods and coastal luxury zones across Nairobi, Mombasa, and Diani, expanding quickly to other East African metropolitan areas.',
      's_677710': 'Route Efficiency Score',
      's_6bde0a': 'Apply Online Now',
      's_6d1c48': 'Earn stars and secure exclusive bonuses. Build private, anonymous reviews that reinforce your stellar reputation with premium hotels.',
      's_75dde0': 'Return to Guest App',
      's_765f2b': 'TRANSPARENT EARNINGS',
      's_777b12': 'Ambassador delivering gourmet meals',
      's_78df83': 'Powerful Analytics for Elite Drivers',
      's_7e32e7': 'Quick online onboarding. Submit details, attend orientation, retrieve your custom elite starter kit, and take your first order in under 48 hours.',
      's_7f255f': 'Deliver high-end products and culinary creations with meticulous care. Be dressed in custom-designed NEXG apparel to reflect elite standards.',
      's_8049d9': 'Weekly Payout Settlements',
      's_85cf78': 'No waiting for week-ends. Complete premium tasks and trigger instant payouts directly into your mobile wallet.',
      's_89bdbf': 'Elevating premium hospitality across East Africa with integrated, contactless concierge ecosystems.',
      's_8b1193': 'Understand your daily yields. Monitor peak areas, identify high-tipping zones, and learn the best hours to go online.',
      's_928714': 'Collect Starter Kit',
      's_933192': 'What it Takes to Be a NEXG Ambassador.',
      's_93a5bc': 'Exec Car',
      's_93fef0': 'Empowered Scheduling',
      's_95e986': 'Take complete control over your working hours. Plan your deliveries around peak fine-dining periods to lock in dynamic high fares.',
      's_97b846': 'Gain exclusive professional training in hospitality service, client management, and path leadership with certificates of excellence.',
      's_981b01': 'Premium Fleet Support',
      's_9ad0cc': 'Contact Us',
      's_9b1690': 'Apply to Fleet',
      's_9d3f52': 'Our advanced routing algorithms guide you efficiently to high-value destinations, minimizing idle mileage and maximizing deliveries per hour.',
      's_9db108': 'Privacy Policy',
      's_a08321': 'Redefining Delivery.',
      's_a1e9f9': 'Explore Home',
      's_a7acb1': 'Work according to your personal schedule. Take shifts during peak fine-dining hours for maximized yield.',
      's_a9577d': 'Secure Site',
      's_ad6c0d': 'KNOWLEDGE BASE',
      's_aed5c5': 'Must possess a clean driving record, valid local driver\'s license for your specified vehicle, and active comprehensive third-party insurance coverage.',
      's_b53080': 'Courier Partner FAQs',
      's_b74c4e': 'Toggle Theme',
      's_bc89aa': 'Empowered Flexibility',
      's_befa37': 'Ambassador scanning the driver app',
      's_c10fec': 'Flawless Modern Vehicle',
      's_c18810': 'Valid Documents & Licenses',
      's_c24cae': 'STEP 02',
      's_c38c49': 'Elite Rank Status',
      's_c71f96': 'Weekly Target Reached',
      's_c88176': 'Access culinary deliveries, spa wellness packages, and executive courier jobs cleanly integrated under a single, highly intuitive screen.',
      's_c887b9': 'About Us',
      's_ce60db': 'Own Your Earnings.',
      's_ce7472': 'Back to Home',
      's_d44881': 'Couriers Hero Background',
      's_d781b4': 'Operational Mapping',
      's_df9144': 'ELITE STANDARDS',
      's_e10068': 'Based on an average base fee of',
      's_e18d8e': 'Courier Earnings Estimator',
      's_e3a7a2': 'Direct payments made straight to your account every single week, with zero hidden fees.',
      's_e3b925': 'STEP 04',
      's_e6e178': 'Cookie Policy',
      's_e72e94': 'Earnings Analytics',
      's_eb35f1': 'Start your application today. Complete the secure onboarding questions and step into a new tier of professional independence and respect.',
      's_ec3c35': 'Stay updated with premier hospitality tips and trends.',
      's_eeb176': 'To guarantee top status, NEXG provides all approved couriers with premium tailored jackets, clean polo shirts, and custom-insulated delivery bags. Black trousers and clean black shoes are required on duty.',
      's_f370c7': 'Our app guides you right up to the designated suite or property zone, avoiding lobby confusion and ensuring frictionless drop-offs.',
      's_f582d4': 'Our dispatch systems minimize your empty miles. Pre-book orders or follow integrated corridors to stack high-paying jobs in a row.',
      's_f6e64a': 'Average Tip per Delivery',
      's_fbe3b3': 'Premium Integrated Hub',
      's_fcf600': 'Retrieve your tailored NEXG jackets, insulated food packs, smartphone bracket, and secure driver login credentials.',
      's_ff2382': 'Couriers Hero Daylight Background',
    },
    forMerchants: {
      's_032a19': 'Our professional curation experts ingest your items, style gorgeous visuals, and optimize layouts for direct contactless guest displays.',
      's_0c343a': 'Apply Online',
      's_0eaa2f': 'Right Where They Are.',
      's_118503': 'Merchants Hero Daylight Background',
      's_1600e2': 'Apply to Join NEXG',
      's_18414d': 'Elite Fleet',
      's_2bf27f': 'STEP 01',
      's_2f5b37': 'Merchant Support',
      's_38769a': 'For Properties',
      's_3f3d89': 'Zero integration headache. Submit your menu or catalogue, let us digitise your portal, and receive curated local sales in 48 hours.',
      's_4d81b2': 'STEP 03',
      's_52a6f3': 'For Partners',
      's_540349': 'Automated Revenue',
      's_591721': 'Higher Avg. Order Value',
      's_673bf7': 'Get paid on time, every time. Once a guest completes checkout, automated, secure merchant payouts route instantly to your bank.',
      's_750959': 'Applications are reviewed by our curation team within 24 hours to ensure our high standards of quality and service are maintained across the platform.',
      's_771412': 'Why Merchants Choose NEXG',
      's_7cb113': 'Multiply Volume',
      's_80b451': 'Instant Split Payouts',
      's_81df05': 'Consistent Orders',
      's_85feef': 'Premium Exposure',
      's_891482': 'We handle everything from digital menu formatting to custom checkout links. Absolutely no technical setup required on your end.',
      's_89a9da': 'Submit your fine dining menus, luxury spa offerings, or rental catalogs through our seamless, intuitive 2-minute onboarding form.',
      's_916b2f': 'Digital Integration',
      's_a1e9f9': 'Explore Home',
      's_a2e8c7': 'Receive Suite Orders',
      's_a92592': 'ONBOARDING TIMELINE',
      's_aa32fa': 'Start Onboarding',
      's_abafb4': 'Prepare packages meticulously. Professional NEXG couriers gather the items, fulfill deliveries, and secure payouts automatically.',
      's_ae23a7': 'Keep orders running flawlessly. Our active support concierge monitors deliveries live and assists with special suite requests.',
      's_b74c4e': 'Toggle Theme',
      's_ba7223': 'Commission on Pickups',
      's_c0228a': 'Reach Customers.',
      's_c24cae': 'STEP 02',
      's_c75030': 'Merchants Hero Background',
      's_c89f38': 'Partner with NEXG App to serve guests directly inside premier luxury properties. We provide white-glove logistics, automated payouts, and seamless integration with your existing team.',
      's_ce7472': 'Back to Home',
      's_ce9fe6': 'Never worry about transport. Our highly vetted professional courier fleet collects your packages and delivers them with elite standards.',
      's_d6626f': 'Zero Friction Setup',
      's_da08fb': 'Seamless Payouts',
      's_def7cc': 'Dedicated Support',
      's_e3b925': 'STEP 04',
      's_e56df8': 'WHY PARTNER WITH US',
      's_e6a013': 'Merchant Terms',
      's_e9cbdf': 'Verified Properties',
      's_f6538e': 'Tap into high-net-worth guests, tourists, and business travelers ordering gourmet meals, personal amenities, or spa treatments.',
      's_f6e1bd': 'Gain exclusive positioning in elite hotel room directories, high-visibility bedside QR cards, and digital concierge web-apps.',
      's_faae3e': 'As guests scan room QR codes, orders stream directly to your merchant dashboard with real-time audio and visual system notifications.',
      's_fe1a29': 'Contact Support',
    },
    forProperties: {
      's_0293af': 'Properties Hero Background',
      's_052b34': 'Guest Satisfaction',
      's_061f53': 'Curated local menus',
      's_06fb24': 'Integrate seamless, world-class concierge services into your luxury rentals and hotels. Empower guests to order gourmet food, book organic spa treatments, and request private transport with a single, contactless scan.',
      's_0a3693': 'Instant access, absolutely zero apps required',
      's_0c8a9a': 'Terms of Service',
      's_0d3b7b': 'Predict high-demand hours to allocate room cleaning, butler services, or external partner delivery drivers with supreme efficiency.',
      's_0e5ae2': 'Unified Service Hub',
      's_110158': 'Help Center',
      's_110820': 'Join hundreds of high-end resorts, boutique hotels, and luxury Airbnb hosts across East Africa that are boosting guest satisfaction and building zero-cost revenue.',
      's_176079': 'Preference Profiles',
      's_17d67c': 'Earnings Estimator',
      's_182ad0': 'Secure automated checkouts, verified premier concierge merchants, and licensed professional couriers guarantee safety and guest peace of mind.',
      's_18414d': 'Elite Fleet',
      's_1be9e5': 'Every QR code is uniquely tied to the guest suite, meaning food deliveries, room cleanings, or requested towels find guests exactly where they are.',
      's_1d2be9': 'Safety Guidelines',
      's_21f4bb': 'Happy Guests',
      's_25096d': 'Upfront Integration Cost',
      's_271358': 'Properties utilizing NEXG Contactless QR systems experience a massive increase in service engagement compared to conventional physical folders.',
      's_29b967': 'Properties CTA Sunset Background',
      's_2bf27f': 'STEP 01',
      's_31c559': 'Elevate Guest Experiences.',
      's_338ed9': 'Earn More Income',
      's_341a50': 'NEXG builds privacy-compliant guest preference profiles to help your staff pre-empt needs before they are even spoken out loud.',
      's_38769a': 'For Properties',
      's_3b6c18': 'Service Response Index',
      's_40c759': 'Average Occupancy Rate',
      's_4216f1': 'Trusted & Safe',
      's_46f477': 'Guests scan, order, and pay instantly. NEXG handles all fulfillment, depositing automatic commission shares to your dashboard.',
      's_49f179': 'We Handle Everything',
      's_4c36e1': 'SETUP TIMELINE',
      's_4d2dec': 'Local Adventures',
      's_4d81b2': 'STEP 03',
      's_4f7049': 'Estimated Monthly Share',
      's_4fdd58': 'Order Conversion Rate',
      's_52a6f3': 'For Partners',
      's_534294': 'We supply custom-crafted physical suite-specific QR cards. Place them in your room directories or high-visibility bedside tables.',
      's_53cdfb': 'DATA INTELLIGENCE',
      's_589ee1': 'Configure & Customise',
      's_5bfbb7': 'The QR Advantage',
      's_5fbc63': 'Unlock Property Potential.',
      's_70a8da': 'Stand Out',
      's_73ba7f': 'Chauffeurs & rentals',
      's_75dde0': 'Return to Guest App',
      's_785c45': 'Powerful Analytics for Modern Managers',
      's_7a1f3a': 'Position your properties as elite, technologically forward luxury destinations. Set a standard of hospitality others can\'t match.',
      's_7b1758': 'Private Cab & Car Hire shares',
      's_7bf908': 'Partner Onboarding',
      's_7c6eec': 'Transform guest behavior into highly actionable insights. Track ordering trends, optimize your staffing, and refine property offerings with real-time analytics.',
      's_7ee992': 'View Demo Video',
      's_818f94': 'Clear real-time transparency audit trail',
      's_8249e7': 'Food & Dining referrals',
      's_8332c9': 'Inventory Speed',
      's_872061': 'Deploy QR Displays',
      's_89bdbf': 'Elevating premium hospitality across East Africa with integrated, contactless concierge ecosystems.',
      's_8c288d': 'Submit your property and suite list online. Our concierge activation specialists verify your layout to launch your space.',
      's_8c8458': 'Why Hosts Choose NEXG',
      's_8d365a': 'Properties Daylight Hero Background',
      's_8e8592': 'Bespoke Tours & Safaris',
      's_8fe3e8': 'Apply & Partner',
      's_9ad0cc': 'Contact Us',
      's_9db108': 'Privacy Policy',
      's_9fd2f3': 'Stop leaving incremental hospitality revenue on the table. Our mutual commission-sharing model turns every guest service interaction into a direct revenue flow for your property, even when fulfilled entirely by trusted third-party merchants.',
      's_a1e9f9': 'Explore Home',
      's_a2cb3c': 'Guests simply point their camera and browse. No logins, no tedious app downloads, just premier high-end service in a couple of seconds.',
      's_a2f3a7': 'Enhanced Experience',
      's_a3fb7a': 'Fine Dining',
      's_a5d6a1': 'Zero integration overhead. Complete hotel setup, display delivery, and automatic digital catalog activation in under 48 hours.',
      's_a62509': 'REVENUE GENERATION',
      's_a9577d': 'Secure Site',
      's_a969aa': 'Safaris & excursions',
      's_a97bcc': 'Unlock a hands-off, zero-effort passive revenue stream by receiving high commission splits from every guest meal, ride, or tour booked.',
      's_aaa399': 'Passive Commissions',
      's_b74c4e': 'Toggle Theme',
      's_c24cae': 'STEP 02',
      's_c50b8f': 'Fully automated payouts and digital reporting',
      's_c5bb5d': 'Average Order Growth',
      's_c86934': 'Total Rooms / Suites',
      's_c887b9': 'About Us',
      's_c9bc84': 'Luxury Transport',
      's_cd4fe8': 'Partner with NEXG',
      's_ce7472': 'Back to Home',
      's_d08ccb': 'Zero Friction Interface',
      's_d15371': 'Delighted guests leave glowing feedback. Maximize your rating scores and booking ranks across Airbnb, Booking, and Expedia.',
      's_d178f4': 'Guest Habit Tracking',
      's_d300d6': 'Better Reviews',
      's_d5d3ea': 'We integrate premier local partner cuisines, spa offerings, and chauffeur fleets into a single, seamless brand-matching portal.',
      's_d8481d': 'Wellness & Spa',
      's_d887cc': 'Understand exactly what your guests prefer. Track peak booking periods, top fine dining cravings, and late-night requests.',
      's_e09921': 'Operational Optimization',
      's_e3b925': 'STEP 04',
      's_e56df8': 'WHY PARTNER WITH US',
      's_e6e178': 'Cookie Policy',
      's_e7f7ee': 'More Bookings',
      's_e87389': 'Loyalty Return Intent',
      's_ea763f': 'Apply for Partnership',
      's_ec3c35': 'Stay updated with premier hospitality tips and trends.',
      's_ee7b88': 'We seamlessly integrate previously fragmented premium local merchants into an elegant singular user experience reflecting your property’s status.',
      's_f04a9d': 'Absolutely zero operational burden for you. From partner restaurant execution to vetted courier logistics, NEXG does all the heavy lifting.',
      's_f59c46': 'Monetize Every Single Stay.',
      's_f77be3': 'Luxury suite with guest scanning QR code',
      's_f90548': 'Deliver unmatched, instant room service, organic spa appointments, and curated local safaris at the simple scan of a finger.',
      's_f907f8': 'One Elite App. Infinite Services.',
      's_fa3fc3': 'Average App Spend per Stay',
      's_fe3f95': 'THE ECOSYSTEM',
    },
    googleReviewsModal: {
      's_0d75a8': 'Google Maps Pin',
      's_273f6f': 'No Google reviews match your selected filter.',
      's_3ea133': 'Verified direct contacts & socials',
      's_6913b8': 'Search reviews for dishes, ambiance, speed...',
      's_6a6eaf': 'Filter by Stars',
      's_6bce42': 'Verified Aspect Scores',
      's_aaf427': 'Atmosphere & Reliability',
      's_ba9553': 'Quality & Execution',
      's_bd9554': 'Reviews synced in real-time with Google Places API',
      's_c34ae8': 'Aspect data collected via Google Places API',
      's_cbac3e': 'App Service',
      's_d45c4f': 'Official Portal',
      's_d6f49f': 'Verified Google Reviews',
    },
    groceriesPage: {
      's_160a42': 'Back to all Purveyors',
      's_340a24': 'Gourmet Cellar & Purveyors',
      's_48028b': 'Artisanal Cellar, Caviar & Fromagerie',
      's_504097': 'Fine Cellar & Epicurean Purveyors',
      's_7447ef': 'Search purveyors, caviar, Dom Pérignon, Bellota, truffles...',
      's_828ad2': 'Insulated Cold Packaging',
      's_a1e9f9': 'Explore Home',
      's_dcc1fb': 'Select Item',
    },
    header: {
      's_64f892': 'Toggle Light/Dark Theme',
      's_7abd6c': 'View Cart',
    },
    hero: {
      's_67300d': 'Clear search',
      's_7ecda2': 'Nocturnal Luxury Penthouse Dining & Skyline',
      's_c75a68': 'Sunlit Luxury Penthouse Infinity Pool and Skyline',
      's_ece6e2': 'Nocturnal Luxury Suite Mobile',
    },
    hostOnboarding: {
      's_00679c': 'Who fulfills it?',
      's_013237': 'Use my location',
      's_0302c0': 'Reception desk, access code process, security desk, host contact, etc.',
      's_0d3b1e': 'Host Portal',
      's_10599c': 'Property name',
      's_10a49a': 'Add a space / unit type',
      's_120c32': 'How are guests identified within the property?',
      's_12e078': 'Name / label',
      's_1596ef': 'Bring your property into NEXG.',
      's_193de6': 'Your host application for',
      's_205866': 'Landmarks, gate instructions, building name, entrance, etc.',
      's_20687f': 'Settlement account',
      's_25916d': 'Price (optional)',
      's_25e7e1': 'Tell guests about the property',
      's_272c68': 'Property features',
      's_292d45': 'Examples of guest requests',
      's_2bbda0': 'For NEXG App Limited',
      's_33becf': 'You\'re ready for verification.',
      's_369c34': 'Property partner',
      's_3cc2c7': 'Signature pad',
      's_415e74': 'Guest capacity',
      's_421a0f': 'Short description of the property, atmosphere and what makes it distinctive...',
      's_486ffa': 'Authorized representative',
      's_49e09b': 'Tax / pricing setup',
      's_4a9200': 'Property / operating permit',
      's_4e17c4': 'By signing below, the authorized representative confirms that the submission is accurate and accepts the applicable NEXG host partnership terms presented during onboarding.',
      's_58eafa': 'Typical request fulfillment time',
      's_616ace': 'Legal / operating entity',
      's_62a764': 'If applicable',
      's_6372ac': 'Host onboarding',
      's_67745b': 'Start another',
      's_692b50': 'Building, street or road',
      's_7013c7': 'The Host remains responsible for the operation, safety, licensing, staffing, availability, pricing and fulfillment of property services. NEXG may coordinate guest requests, transactions and related workflows according to the agreed configuration.',
      's_75d65e': 'Your progress is saved locally on this device.',
      's_773613': 'Rooms / units',
      's_782667': 'HOST SETUP',
      's_7af122': 'Tap or click the map to set the exact property point.',
      's_7b12e1': 'Add the requests your team actually handles today.',
      's_7bba35': 'Property cover image',
      's_810878': 'Tell us what exists, what guests can access, and how your team operates. We\'ll use this to build your property profile and guest experience.',
      's_82c7e7': 'Back to the host portal',
      's_849305': 'Signature method',
      's_86adcf': 'Year opened',
      's_893bd7': 'Authorized signatory name',
      's_897c71': 'Clear signature',
      's_8ad7ea': 'Property type',
      's_8dc8f7': 'What would you like NEXG to help you expose to guests?',
      's_8e3c7a': 'Website / booking page',
      's_924da1': 'Describe your property type',
      's_93cfd5': 'What kind of property is it?',
      's_9550a5': 'Departments / teams available',
      's_99d32f': 'Back to host portal',
      's_9d617c': 'What can guests access or request?',
      's_a2a1b1': 'The Host agrees to maintain accurate property information and reasonable service availability, and to notify NEXG of material changes that could affect guest fulfillment.',
      's_a68df4': 'Check-in / arrival instructions',
      's_a6d2ea': 'The Host confirms that the information supplied about the property, its operating model, guest-accessible spaces and services is accurate to the best of their knowledge and that they are authorized to provide it.',
      's_a8dc5c': 'What does the property include?',
      's_aa1d9b': 'What do you want guests to transact for?',
      's_ae7f40': 'Check-out time',
      's_b45dc8': 'Anything you currently struggle to make visible, bookable, purchasable or easy for guests to request...',
      's_b501d3': 'Request / service',
      's_b50578': 'Upload square logo',
      's_b5508b': 'Property setup',
      's_be3ecd': 'Account holder name',
      's_bf72f7': 'Settlement details should be verified before activation. Do not use this form for card or wallet credentials.',
      's_c0b7d7': 'Pin the property',
      's_c250a9': 'Property access',
      's_c36127': 'Save / Print',
      's_ca1948': 'For Host',
      's_ca9b4a': 'How should guests find you?',
      's_cde9a5': 'Optional notes, amenities or access details',
      's_ce9840': 'Submitted information may be reviewed for onboarding, verification, operations, support, settlement and guest-experience purposes. Additional verification may be requested before activation.',
      's_d1d7c9': 'Full legal name',
      's_d90fdd': 'Operating model',
      's_e400b7': 'How do guest requests reach your team today?',
      's_e45952': 'Who should receive NEXG requests?',
      's_e4cee9': 'Application received',
      's_e61a08': 'M-PESA Till / Paybill',
      's_e9c696': 'Are you onboarding more than one property?',
      's_eb7eb7': 'Choose file',
      's_ecc61a': 'Please complete the highlighted fields before continuing.',
      's_edbfdd': 'Property logo',
      's_f0ac0a': 'Pending verification',
      's_f548ec': 'Business / registration document',
      's_f71497': 'Check-in time',
      's_faea7e': 'NEXG App Limited',
      's_fbd2e5': 'Registered company or operating name',
      's_ff1835': 'NEXG Operations',
    },
    languageSwitcher: {
      's_03e64a': 'Change Language (English, 中文, Kiswahili, العربية)',
      's_99547d': 'Select Regional Language',
      's_b8cc8e': 'Language Selector',
    },
    merchantAdCarousel: {
      's_297522': 'Sponsored partner offers',
      's_2d4e52': 'PARTNER SPOTLIGHT',
      's_3340de': 'Exclusive host and verified partner privileges',
      's_430fac': 'Enable location to see trending offerings near you',
    },
    merchantCard: {
      's_3beea0': 'Save to favorites',
      's_960d55': 'Popular offerings',
    },
    merchantItemModal: {
      's_062e79': 'Increase quantity',
      's_6c02ab': 'Decrease quantity',
    },
    merchantOnboarding: {
      's_00b623': 'Upload business certificates and company logos. These will be used to dynamically set up your store theme inside the NEXG customer application.',
      's_012a51': 'Please register the legal trading entities. Correct tax identifiers help guarantee smooth fast payouts.',
      's_01edab': 'Search Location Finder',
      's_02aa9a': 'Input branch parameters. You can search using Nominatim autocomplete finder or drop coordinates via the map.',
      's_0bd62e': 'Account Number',
      's_0cb1d6': 'Authorized Officer Signature',
      's_108c09': 'NEXG Riders Fleet',
      's_197803': 'Above 60 minutes',
      's_1c7169': 'Logo preview',
      's_1cf31b': 'Generated via map picker',
      's_20f7df': 'Closing Time *',
      's_21f543': 'Facebook page',
      's_22691e': 'Provide a brief summary of specialties, offerings, or history (max 150 characters)',
      's_26a2ff': 'Based on your category, select common sections to organize your items or add custom ones.',
      's_2eabdb': 'Partnership Agreement Contract',
      's_312631': 'Bank Name',
      's_39e42f': 'Interactive catalog listing on the premium NEXG Client App.',
      's_3e95c1': 'Nominate your payouts destinations. Weekly settlements are transferred directly every Monday morning.',
      's_3fa081': 'You selected',
      's_411097': 'None selected yet. Choose suggestions or add a custom one below.',
      's_4331e0': 'Holiday Closing Time',
      's_4baf91': 'Short Business Description',
      's_4f2047': 'Maintain exact availability schedules, correct pricing, and stock sync lists.',
      's_540d0d': 'Suggested Sections',
      's_550c6f': 'Register primary coordinates. Authorized officers receive system orders, accounts payouts auditing details, and alerts.',
      's_5664e0': 'The Merchant is solely responsible for clearing customs duties, port levies, and ensuring all shipping cargo meets international and local compliance standards.',
      's_59c22e': 'Upload Banner Image',
      's_5fa789': 'You can select multiple specific types if your outlet handles different luxury segments.',
      's_676418': 'Business Paybill No.',
      's_67de19': 'Provide premium white-glove deliveries & concierge orders to luxury customers in Kenya.',
      's_7122f5': 'Business Profile',
      's_71c904': 'NEXG APP LIMITED',
      's_721462': 'Director ID / Passport Scan',
      's_7308b8': 'Review the pre-drafted legal contract. Ensure all merchant parameters, locations, and banking details are correct.',
      's_8242a9': 'Upload business registration scan PDF or image.',
      's_85273b': 'Confirm Coordinates',
      's_869b48': 'NEXG Legal Representative',
      's_87a51d': 'Own Store Riders',
      's_89ac4c': 'Hours Configuration Template',
      's_8c1404': 'Instagram profile',
      's_91091f': 'Type landmark e.g. Yaya Centre, Westlands, Sarit...',
      's_91dd0b': 'TikTok profile',
      's_928d67': 'Coordinates Map Link',
      's_9441e0': 'Branch Manager / Contact Person',
      's_959d0c': 'For NEXG APP LIMITED',
      's_963f97': 'Average Preparation Time',
      's_9d4f8b': 'Type your full legal name',
      's_a03653': 'Expand Your Business with NEXG',
      's_a0b2cf': 'Search categories e.g. Food, Safe, Spa, Flight...',
      's_a133eb': 'Click to add',
      's_a4d472': 'NEXG operates logistics carriage from your store using our background-checked professional couriers.',
      's_a5d0ab': 'Certificate of Registration',
      's_abf9f4': 'Banner preview',
      's_b03404': 'Your premium merchant onboarding is complete. Our partnership audit committee will complete verify checks and activate your store front within 24 hours.',
      's_b32233': 'Website URL',
      's_b62775': 'Upload ID or passport of major primary director.',
      's_b639de': 'Add Section',
      's_b8579d': 'Payment Details',
      's_b9084a': 'Choose Category',
      's_b9f2b1': 'Operating Days',
      's_b9ffbd': 'Merchant Partnership Agreement',
      's_bb20e3': 'For THE MERCHANT',
      's_c05283': 'Choose the category that best aligns with your merchant store operations. Use search or filter down instantly.',
      's_c5955e': 'Opening Time *',
      's_c6846b': 'Signature drawing',
      's_d1bf6b': 'Kenyan Public Holidays Availability',
      's_d1d21f': 'Collection and processing of accounts charges from guests, tourists, and corporate networks.',
      's_d33bf6': 'Merchant Portal',
      's_d7a397': 'Branch Contact Phone',
      's_d890b7': 'Branch Location',
      's_db3b79': 'Account Name',
      's_e0a26d': 'Logistics carriage orchestration based on requested parameters.',
      's_e58331': 'Handwriting Style Preview',
      's_e79369': 'Store Branches & Location Map',
      's_eab077': 'Delivery Carriage Modes',
      's_eab952': 'WhatsApp Dispatch No.',
      's_ebaf4a': 'Paybill Account Name',
      's_ed6a3f': 'Holiday Opening Time',
      's_f1dd4c': 'Buy Goods Till No.',
      's_f7c245': 'Onboard Another Store',
      's_faea7e': 'NEXG App Limited',
    },
    merchantPage: {
      's_c902a1': 'Open Now',
    },
    merchantPreviewSheet: {
      's_0f4c5c': 'This merchant does not declare its own workflow, so the default for its category is shown.',
      's_28da6e': 'See all offerings',
      's_baa550': 'Close preview',
    },
    merchantRoute: {
      's_176135': 'The API may not be running. Start it with',
      's_a1ca54': 'Loading merchant',
      's_e84712': 'Go back',
    },
    merchantView: {
      's_085b31': 'No offerings listed yet',
      's_3fcbae': 'Menu sections',
      's_67300d': 'Clear search',
    },
    metricsDashboard: {
      's_048f2f': 'Status breakdown',
      's_0dd383': 'API version',
      's_1c8836': 'Built at',
      's_235f7b': 'Events accepted',
      's_236a59': 'Bars are per-bucket counts derived from the API\'s cumulative Prometheus buckets.',
      's_266384': '5xx error rate',
      's_406acb': 'Requests / minute',
      's_41e8de': 'Recent traces (/api/traces)',
      's_461aff': 'No spans buffered yet.',
      's_58b6dc': 'In flight',
      's_5dd968': 'Events dropped',
      's_65916f': 'Browser events arrive only from visitors who granted analytics consent.',
      's_74d595': 'No metrics available',
      's_74efa0': 'Metrics API unreachable.',
      's_75e157': 'The dashboard polls',
      's_8474ec': 'No samples yet.',
      's_886fb2': 'Client telemetry',
      's_9d5b00': 'Slowest routes (by p95)',
      's_a41501': 'Runtime, build and data source',
      's_b0ad50': 'No routes recorded yet.',
      's_c347b1': 'Service metrics',
      's_cc1e6a': 'Duration histogram',
      's_cec477': 'Last 60s',
      's_e4076f': 'Collecting samples. The line appears after the second poll.',
      's_ee9d59': 'Database reads',
      's_f8fd6e': 'No responses recorded yet.',
      's_ffb77d': 'Data source',
    },
    nexGCategoryDrilldown: {
      's_03f70c': 'Merchant Providers & Partners',
      's_09efe8': 'Choose a time',
      's_0df6f0': 'Switch Provider',
      's_0ecb20': 'Confirm & Reserve Instant Dispatch',
      's_126f44': 'Preferred Time',
      's_19ad69': 'Scheduled Date',
      's_1b8543': 'Reset All Filters',
      's_1f647f': 'Special Offers',
      's_27c636': 'Complete view',
      's_2994b4': 'Scroll right',
      's_2c9e5a': 'Scroll left',
      's_2f1873': 'All Items',
      's_34318e': 'Rating 4.8+',
      's_492026': 'Add to Order',
      's_4ce3f0': 'Select a Merchant Provider Above',
      's_50238f': 'No upfront charge. Escrow reservation handled by concierge desk.',
      's_543b1b': 'Your reservation for',
      's_5be698': 'Reset Filters',
      's_77bf79': 'Reserve / Book',
      's_7db318': 'Back to Discovery',
      's_8978ea': 'Decision Specifications',
      's_8bf67b': 'Nairobi Luxury District',
      's_9dca31': 'No items found matching your filters.',
      's_ab2d11': 'Under 25 min',
      's_c07c6d': 'Suite Number or Location Notes',
      's_c14e04': 'Browse catalog offerings with real-time pricing and availability',
      's_c25b51': 'Strict Category & Subcategory Catalog',
      's_d394a9': 'Highest Rated',
      's_e16a1d': 'Explore dedicated subcategories with specialized imagery and custom parameters',
      's_eb13c4': 'To view item cards, please click any of the verified merchant providers above. Their full 30-item catalog, specifications, and instant ordering will appear here.',
      's_fae58c': 'Clear Selection',
      's_fcdcf7': 'Fast selections & customer favorites',
    },
    nexGCollectionRail: {
      's_0b3917': 'Curated Collection',
      's_2994b4': 'Scroll right',
      's_2c9e5a': 'Scroll left',
      's_986032': 'Explore All',
    },
    nexGDiscoveryView: {
      's_6d9483': 'Browse verified Nairobi merchants across 20 neighborhoods with Wolt-grade previews',
      's_741311': 'Search food, spa, safaris, champagne, chauffeur...',
      's_76cb8c': 'Previous categories',
      's_844b94': 'Next categories',
      's_8f8796': 'High-priority concierge delivery direct to your suite or villa in under 30 minutes',
      's_a9176a': 'Explore Verticals & Categories',
      's_b0a3fc': 'All Verified Partners & Merchants',
      's_df4cf6': 'Instant Suite Express',
    },
    nexGEntityCard: {
      's_085ed0': 'View catalog & pricing',
    },
    nexGItemSheet: {
      's_0932f6': 'Special App Notes or Dietary Preferences',
      's_22b77f': 'Appointment & Scheduling',
      's_24a16c': 'Session Duration',
      's_3beea0': 'Save to favorites',
      's_65d22e': 'Close sheet',
      's_68f2d8': 'Preferred Date',
      's_693039': 'Time Slot',
      's_a99ee2': 'Number of Guests / Attendees',
      's_c6cf76': 'Added to Experience Order',
      's_d0e359': 'Curated Enhancements & Add-ons',
      's_eeea54': 'NEXG App Guarantee',
    },
    nexGLandingHero: {
      's_0b8149': 'Sign up',
      's_2bd100': 'Enter delivery address, villa or hotel suite...',
      's_381d79': 'Nairobi Villas',
      's_52a6f3': 'For Partners',
      's_71a30d': 'Change Delivery Location',
      's_e17357': 'Active App Fleet in Nairobi',
      's_f7c400': 'Log in',
      's_fa918a': 'Locate my position',
    },
    nexGSearchEngine: {
      's_c5b914': 'No direct matches found',
      's_cd81f4': 'Search Results for',
    },
    offercarousel: {
      's_10bb09': 'Previous Slide',
      's_2aa5dc': 'View Offer',
      's_7141bc': 'Next Slide',
    },
    orderTrackingModal: {
      's_116632': 'Estimated Delivery',
      's_375813': 'Fast forward simulation to next lifecycle stage',
      's_43301e': 'Call Courier',
      's_536456': 'Courier Tip',
      's_61243a': 'Simulated Payment Method',
      's_6e6109': 'Copy delivery security PIN',
      's_74e226': 'Itemized Receipt & PIN',
      's_84e3ee': 'Dismiss / Back to App',
      's_976a74': 'Transaction Reference',
      's_9c12c6': 'Delivery Fee',
      's_9ca905': 'This is an automated simulation of the client ordering lifecycle in NEXG App. No actual payment provider has been billed. Once connected to the live API gateway, genuine payments will be processed via M-Pesa or Stripe.',
      's_9fb5a8': 'Delivery PIN',
      's_a392ce': 'Live Progress Stages',
      's_b868ce': 'Message Courier',
      's_cbac3e': 'App Service',
      's_cd1876': 'Your Location',
      's_d6e963': 'Minimize tracking',
      's_ea2152': 'Live Journey & ETA',
      's_f56564': 'On schedule',
    },
    productcarousel: {
      's_10bb09': 'Previous Slide',
      's_7141bc': 'Next Slide',
    },
    promo: {
      's_38769a': 'For Properties',
      's_4a421c': 'For Merchants',
      's_c63982': 'For Couriers',
      's_d2c984': 'NEXG App App Interface',
    },
    restaurantDetailModal: {
      's_034ad6': 'Recent Google Reviews',
      's_116c19': 'Hospitality & Service',
      's_3beea0': 'Save to favorites',
      's_4f2130': 'Google Restaurant Reviews',
      's_52aed7': 'Food Quality',
      's_56ba29': 'No dishes match your search criteria.',
      's_649ff9': 'Add to order',
      's_652bc8': 'Posted on Google',
      's_79db72': 'View & Write Reviews',
      's_79fe15': 'View Google Reviews',
      's_9c203d': 'Artisanal Menu',
      's_9f068b': 'Verified Place',
      's_a023e6': 'Chef Pick',
      's_b05630': 'Synced Live',
      's_b38795': 'Search dishes...',
      's_c152be': 'No Google reviews loaded for this venue.',
      's_e1c6bf': 'Atmosphere & Transport',
      's_f4657b': 'Google Maps Rating',
    },
    restaurants: {
      's_0721cf': 'Your reservation at',
      's_072c89': 'Reserve Table',
      's_0c8f01': 'Table Reservation',
      's_25b120': 'Selected Reservation',
      's_2c3b25': 'Confirm Table',
      's_34df71': 'Search dining partners, sushi, dry-aged steaks, pasta...',
      's_4f9fa0': 'Google Maps Location',
      's_5be698': 'Reset Filters',
      's_5f716b': 'Try adjusting your search keywords or resetting cuisine filters.',
      's_6b2c05': 'Fine Dining Partners',
      's_7288fd': 'Fine Dining Partners & Master Chefs',
      's_868fb0': 'Click any dish to configure ingredients, accompaniments, or place a simulated order',
      's_99256e': 'Curated Culinary Directory',
      's_9da221': 'Featured Partner',
      's_a1e9f9': 'Explore Home',
      's_ae0cb2': 'Signature Dishes & Menu Offerings',
      's_bf0c7d': 'Back to all Dining Partners & Merchants',
      's_cfdf8b': 'Search menu dishes...',
      's_d97dd5': 'View Google Reviews & Diner Insights',
      's_dde236': 'Customize & Order',
      's_e25e77': 'Select a merchant to explore their Michelin-grade menu, signature dishes, verified Google diner reviews, and table reservations.',
      's_eac205': 'No dining partners match your filters',
    },
    routeFallback: {
      's_1c5772': 'Loading page',
    },
    scrollToTop: {
      's_f07710': 'Scroll to top',
    },
    spaBookingModal: {
      's_039d05': 'Experience Setting',
      's_09121f': 'Appointment Slot',
      's_15ddf4': 'District Wellness Experience',
      's_17548b': 'Slot Scheduled',
      's_2fd731': 'Signature Aromatherapy Oil',
      's_301d19': 'Live Dispatch Progress',
      's_4548b7': 'Our certified therapist will arrive 10 minutes prior with sanitized organic towels, ultrasonic mist diffuser, and a heated memory-foam bed.',
      's_485336': 'Villa / Suite Number',
      's_4b8ec9': 'Private In-Villa Sanctuary',
      's_5621b9': 'Focus Areas & Medical Notes',
      's_712231': 'Contact Spa Concierge',
      's_7d1e9d': 'Private oceanfront cabana with thermal plunge pool & tranquil zen garden access.',
      's_8cff8d': 'Total Experience Fee',
      's_9092d9': 'Add to Calendar',
      's_9505aa': 'Total Concierge Charge',
      's_950d86': 'Massage Pressure Preference',
      's_9a36a0': 'Confirm Spa Booking',
      's_9e603c': 'Therapist dispatches directly to your villa with heated table, organic linens & aromatherapy.',
      's_a027ba': 'Select Ritual Duration',
      's_b3a5a1': 'Concierge In-Villa Service Protocol',
      's_be9475': 'Therapist Preference',
      's_c0a672': 'Appointment Confirmed',
      's_c8c5fe': 'Primary Guest Name',
      's_f00e02': 'Assigned Master Therapist',
      's_f79d9c': 'Resort Spa Pavilion',
    },
    spaWellness: {
      's_120405': 'Select Ritual',
      's_3669be': 'Book Calendar',
      's_5276ac': 'Your appointment at',
      's_5dfb4e': 'Spa & Wellness Sanctuaries',
      's_659a92': 'Search spa sanctuaries, Balinese, deep tissue, sauna...',
      's_689bea': 'Back to all Sanctuary Partners',
      's_69d23c': 'District Holistic Wellness & Spa',
      's_9aabe9': 'Book Session',
      's_a1e9f9': 'Explore Home',
      's_c1c2fb': 'Sanctuary Spas & In-Villa Wellness',
      's_d02cb4': 'Search rituals & massages...',
      's_eb9e1e': 'Confirm Booking',
      's_f212ea': 'Spa Sanctuary Reservation',
      's_f2937f': 'Select duration, botanical essential oils, and schedule an immediate in-villa or pavilion appointment',
      's_fda6e0': 'Select a wellness sanctuary to browse certified therapists, in-villa Balinese massages, Ayurvedic Shirodhara, and hydrothermal rituals.',
      's_fe0476': 'Sanctuary Treatments & In-Villa Rituals',
    },
    stats: {
      's_034abd': 'From hotels to homes, we make everyday exceptional.',
      's_826dd3': 'Hotel Partners',
      's_bd3fa2': 'Our Partners',
      's_dc04b9': 'Dar es Salaam',
      's_e819e6': 'Concierge Support',
      's_f2a377': 'Trusted by guests',
    },
    transportBookingModal: {
      's_1505c5': 'Live Dispatch Status',
      's_160ad9': 'Chauffeur Confirmed',
      's_251e18': 'Dedicated Chauffeur Hours',
      's_314bee': 'Total Concierge Fee',
      's_358b66': 'Pickup Time',
      's_36a60c': 'Done & Return to App',
      's_39b21c': 'Call Chauffeur',
      's_457b66': 'Total Rate',
      's_6f672b': 'Assigned Chauffeur',
      's_77ae94': 'Scheduled Departure',
      's_7a4175': 'Schedule Date',
      's_8941e9': 'Service Type',
      's_8dea76': 'Pickup Location',
      's_99d1c7': 'Confirm VIP Chauffeur',
      's_9ca1bd': 'Day After',
      's_a1cbc4': 'VIP Meet & Greet + Airport Flight Sync',
      's_b68827': 'Villa / Suite Room',
      's_be057d': 'Guest Name',
      's_cd11b4': 'Complimentary On-Board Amenities',
      's_d0cd2d': 'Flight Number / Departure Code',
      's_efb6c4': 'Continue to Amenities',
      's_f2f922': 'VIP Concierge Mobility',
    },
    transportPage: {
      's_1836d5': 'Choose a luxury mobility merchant to view available Maybach S680s, Rolls-Royce Ghost motorcars, Cadillac Escalade ESVs, or twin-engine helicopter transfers.',
      's_1afb28': 'Back to all Mobility Partners',
      's_2ea911': 'Chauffeur Reservation',
      's_3390d4': 'Reserve Chauffeur',
      's_3727e7': 'Book Transfer',
      's_52b224': 'VIP Chauffeur & Mobility Providers',
      's_543b1b': 'Your reservation for',
      's_784e6e': 'Search mobility providers, Maybach, Rolls-Royce, helicopter...',
      's_875bd6': 'Executive Chauffeurs & Private Aviation',
      's_898adc': 'VIP White-Glove Mobility',
      's_93f4b8': 'Pickup Date & Time',
      's_a1e9f9': 'Explore Home',
      's_eac49e': 'Book Vehicle',
      's_eb9e1e': 'Confirm Booking',
    },
    unifiedItemModal: {
      's_0125ec': 'View All Reviews',
      's_1cc3d0': 'Aromatherapy Essential Oil',
      's_3c0047': 'Dedicated Appointment Calendar',
      's_4c13f0': 'App Notes & Villa Details',
      's_5d14d6': 'E.g. Villa Suite 402, gate access code, dietary allergies, or arrival notes...',
      's_94c578': 'Confirm Calendar Reservation',
      's_a027ba': 'Select Ritual Duration',
      's_bf3b18': 'Add to App Cart',
      's_ee3e2e': 'About this offering',
      's_ee749a': 'Total Estimate',
    },
  },

  /*
    SHARED FORM VOCABULARY.

    These are the strings that appear on more than one form — an email label on four onboarding
    flows, "Save draft" on three. Extracting them means a later component references a key that
    already exists rather than adding a fifty-first way to say "Full name".

    Scoped deliberately: it holds what is genuinely common and nothing else. Form-specific copy
    ("Driver's License Expiry Date", "E.g. KMCA 123A") stays with its own screen, because
    collecting one-off strings into a shared block is how a shared block becomes unmaintainable.

    Placeholders use {braces} where a value is substituted. See forms.stepOf.
  */
  forms: {
    actionSave: 'Save',
    actionSaveDraft: 'Save draft',
    actionContinue: 'Continue',
    actionBack: 'Back',
    actionNext: 'Next',
    actionCancel: 'Cancel',
    actionConfirm: 'Confirm',
    actionSubmit: 'Submit',
    actionReview: 'Review',
    actionEdit: 'Edit',
    actionRemove: 'Remove',
    actionUpload: 'Upload',
    actionTryAgain: 'Try again',
    fullName: 'Full name',
    emailAddress: 'Email address',
    phoneNumber: 'Phone number',
    whatsappNumber: 'WhatsApp number',
    nationalId: 'National ID number',
    dateOfBirth: 'Date of birth',
    county: 'County / region',
    addressStreet: 'Address / street',
    areaNeighbourhood: 'Area / neighbourhood',
    preferredContact: 'Preferred contact method',
    documentType: 'Document type',
    documentUpload: 'Upload document',
    documentExpiry: 'Expiry date',
    businessRegistration: 'Business registration document',
    taxPin: 'Tax PIN',
    certificateOfIncorporation: 'Certificate of incorporation',
    bankName: 'Bank name',
    accountName: 'Account name',
    accountNumber: 'Account number',
    branchName: 'Branch',
    mobileMoneyNumber: 'Mobile money number',
    paymentMethod: 'Payment method',
    chooseDate: 'Choose a date',
    chooseOption: 'Choose an option',
    selectYourRole: 'Select your role',
    yes: 'Yes',
    no: 'No',
    optional: 'Optional',
    required: 'Required',
    thisFieldRequired: 'This field is required',
    enterValidEmail: 'Enter a valid email address',
    enterValidPhone: 'Enter a valid phone number',
    selectOneOption: 'Please select an option',
    uploadRequired: 'Please upload the required document',
    stepOf: 'Step {current} of {total}',
    unsavedChanges: 'You have unsaved changes',
    placeholderFullName: 'Your full name',
    placeholderEmail: 'you@example.com',
    placeholderPhoneKe: '+254 7XX XXX XXX',
    placeholderExample: 'E.g. {value}',
  },
    nav: {
      home: 'Home',
      explore: 'Explore',
      restaurants: 'Fine Dining',
      spa: 'Spa & Wellness',
      spaDistrict: 'District',
      transport: 'VIP Mobility',
      groceries: 'Fine Cellar',
      experiences: 'Experiences',
      partners: 'Partners',
      forProperties: 'For Properties',
      forCouriers: 'For Couriers',
      forMerchants: 'For Merchants',
      partnerOnboarding: 'Partner Onboarding',
      applyFleet: 'Apply to Fleet',
      listBusiness: 'List Your Business',
      track: 'Track',
      viewCart: 'View Cart',
      appearanceMode: 'Appearance Mode',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      selectLanguage: 'Select Language',
      menu: 'Menu',
      close: 'Close',
    },
    hero: {
      badge: 'Curated Hospitality App',
      titleLine1: 'Everything you need',
      titleLine2: 'Right where you are.',
      subtitle: 'Order curated gourmet dishes, book sanctuary spa treatments, arrange VIP chauffeurs, and enjoy swift concierge delivery directly to your villa, room, or residence.',
      searchPlaceholder: 'Search dining, spa, rides...',
      searchBtn: 'Search',
      popular: 'Popular:',
      sugMichelin: 'Michelin Dining',
      sugMassage: 'Balinese Massage',
      sugMaybach: 'Maybach Chauffeur',
      sugCaviar: 'Caviar & Cellar',
      sugYacht: 'Yacht Charter',
      btnFineDining: 'Fine Dining',
      btnSpa: 'Spa & Wellness',
      btnMobility: 'VIP Mobility',
      ambienceDaylight: 'Daylight Sunlit Ambience',
      ambienceTwilight: 'Twilight Ambient View',
    },
    categories: {
      heading: 'Available Categories',
      subtitle: 'Tap any category below to browse curated in-villa dining, wellness, mobility & amenities.',
      groceriesTitle: 'Groceries',
      groceriesDesc: 'Fine cellar, caviar & fresh villa pantry',
      transportTitle: 'Transport',
      transportDesc: 'Airport Maybach, Rolls-Royce & Heli',
      spaTitle: 'Spa & Wellness',
      spaDesc: 'In-villa Balinese, facials & hydrothermal',
      restaurantsTitle: 'Restaurants',
      restaurantsDesc: 'Michelin & luxury dining room service',
      experiencesTitle: 'Experiences',
      experiencesDesc: 'Yacht charters, heli tours & polo clubs',
      essentialsTitle: 'Essentials',
      essentialsDesc: 'Personal care, wellness & hydration',
      viewAll: 'Explore All Categories',
    },
    howItWorks: {
      badge: 'The NEXG marketplace',
      heading: 'NEXG connects Nairobi’s services',
      subtitle: 'Browse services across Nairobi, then order, book or request—in three clear steps.',
      step1Title: 'Scan or Open',
      step1Desc: 'Scan the in-suite QR code or access our portal directly from any device without downloading apps.',
      step2Title: 'Explore 21 categories',
      step2Desc: 'Find restaurants, groceries, pharmacy, wellness, transport, local experiences and more in one marketplace.',
      step3Title: 'Order, book or request',
      step3Desc: 'Choose the action available: place an order, book a time, request a service or ask for a quote.',
    },
    promo: {
      badge: 'Exclusive Guest Privileges',
      heading: 'Complimentary App Delivery on First Order',
      desc: 'Enjoy zero delivery surcharge across all Michelin partner dining and fine cellar collections with your room authorization.',
      cta: 'Explore Dining Now',
      code: 'Use code: VILLA2026',
      appHeading1: 'Take NEXG',
      appHeading2: 'everywhere',
      appSubtitle: 'The all-in-one app for guests, residents and travelers.',
      downloadOn: 'Download on the',
      appStore: 'App Store',
      getItOn: 'GET IT ON',
      googlePlay: 'Google Play',
      merchantsTitle: 'For Merchants',
      merchantsDesc: 'Grow your business with NEXG.',
      merchantsCta: 'Partner with us',
      couriersTitle: 'For Couriers',
      couriersDesc: 'Deliver excellence. Join our fleet.',
      couriersCta: 'Apply now',
      propertiesTitle: 'For Properties',
      propertiesDesc: 'Elevate your guest experience.',
      propertiesCta: 'List with us',
    },
    features: {
      badge: 'Excellence & Trust',
      heading: 'Standard of Luxury Hospitality',
      subtitle: 'Why top-tier resorts, private residences, and discerning guests rely on NEXG.',
      feat1Title: '24/7 Dedicated Support',
      feat1Desc: 'Instant multilingual support for custom dietary requests, private bookings, and timed delivery.',
      feat2Title: 'Michelin & Premier Partners',
      feat2Desc: 'Direct integration with city landmark restaurants, certified sommeliers, and accredited spa therapists.',
      feat3Title: 'Discreet Security & Privacy',
      feat3Desc: 'Encrypted room billing, contactless delivery protocols, and complete guest confidentiality.',
      feat4Title: 'Swift Temperature-Controlled Fleet',
      feat4Desc: 'Custom thermal carriers and pristine executive vehicles ensure every dish and beverage arrives in peak condition.',
      f1Title: 'Secure payments',
      f1Desc: 'Safe & encrypted',
      f2Title: 'Real-time tracking',
      f2Desc: 'Know where it is',
      f3Title: 'Multiple options',
      f3Desc: 'Card, M-Pesa & more',
      f4Title: 'Discreet delivery',
      f4Desc: 'Privacy guaranteed',
    },
    restaurants: {
      title: 'Fine Dining & Room Service',
      subtitle: 'Curated menus from premier culinary destinations delivered piping hot directly to your table.',
      searchPlaceholder: 'Search restaurants, sushi, wagyu, truffle pasta...',
      filterAll: 'All Cuisines',
      filterJapanese: 'Japanese / Omakase',
      filterItalian: 'Italian / Pasta',
      filterFrench: 'French Haute',
      filterMediterranean: 'Mediterranean',
      filterSteakhouse: 'Steakhouse & Grill',
      filterDesserts: 'Artisan Pastry',
      viewMenu: 'View Menu',
      minOrder: 'Min Order',
      deliveryTime: 'Est. Delivery',
      featuredDish: 'Signature Highlight',
      addToBag: 'Add to Bag',
      closed: 'Closed for Prep',
      openNow: 'Available Now',
    },
    spa: {
      title: 'Sanctuary Spa & Wellness',
      subtitle: 'Transform your villa into a private haven with world-class massage therapists and body treatments.',
      bookTreatment: 'Book Therapy',
      duration: 'Duration',
      inVilla: 'In-Villa / Suite',
      sanctuary: 'Resort Pavilion',
      therapistGender: 'Therapist Preference',
      anyTherapist: 'No Preference',
      femaleTherapist: 'Female Therapist',
      maleTherapist: 'Male Therapist',
      reserveNow: 'Reserve Session',
    },
    transport: {
      title: 'VIP Mobility & Executive Chauffeurs',
      subtitle: 'On-demand Maybach sedans, Range Rover VIP SUVs, and helicopter charter transfers.',
      chauffeurIncluded: 'White-Glove Chauffeur Included',
      perHour: '/ hour',
      airportTransfer: 'Airport VIP Transfer',
      bookChauffeur: 'Book Ride',
      capacity: 'Seats',
      luggage: 'Luggage capacity',
      instantDispatch: 'Priority Immediate Dispatch',
    },
    groceries: {
      title: 'Fine Cellar & Villa Pantry',
      subtitle: 'Grand cru champagnes, Beluga caviar, gourmet charcuterie, and organic fresh breakfast provisions.',
      cellar: 'Grand Cru Cellar',
      pantry: 'Gourmet Pantry',
      caviar: 'Caviar & Delicacies',
      bakery: 'Morning Bakery',
      addToCart: 'Add to Order',
      inStock: 'Ready for Immediate Dispatch',
    },
    experiences: {
      title: 'Curated VIP Experiences',
      subtitle: 'Unforgettable private yacht cruises, heli sky tours, desert glamping, and private polo lessons.',
      bookExperience: 'Inquire & Reserve',
      groupSize: 'Max Capacity',
      duration: 'Experience Length',
      vipHostIncluded: 'Dedicated Host',
    },
    cart: {
      title: 'Your Bag',
      emptyTitle: 'Your Bag is Empty',
      emptyDesc: 'Explore our fine dining, spa therapies, cellar vintages, or luxury rides to begin your order.',
      exploreBtn: 'Explore Culinary & Services',
      subtotal: 'Items Subtotal',
      deliveryFee: 'White-Glove Delivery',
      conciergeService: 'Service Fee (5%)',
      total: 'Total Amount',
      checkoutBtn: 'Proceed to Villa Authorization',
      villaPlaceholder: 'Villa / Suite / Penthouse No.',
      specialNotes: 'Special chef instructions or delivery timing...',
      orderPlaced: 'Order Successfully Placed!',
      items: 'items',
      clearCart: 'Clear Bag',
    },
    tracking: {
      title: 'Live Order Tracking',
      orderNumber: 'Order ID',
      estimatedArrival: 'Estimated Arrival',
      mins: 'minutes',
      statusConfirmed: 'Order Confirmed by App',
      statusPreparing: 'Kitchen / Merchant Preparation',
      statusInTransit: 'Elite Courier in Transit',
      statusDelivered: 'Delivered to Villa',
      courierAssigned: 'Assigned Courier',
      contactConcierge: 'Contact Support',
      close: 'Minimize Tracker',
    },
    footer: {
      brandDesc: 'The ultimate luxury guest hospitality platform. Connecting five-star resorts, private villas, and high-net-worth travelers with the finest local culinary masters, wellness specialists, and executive mobility.',
      exploreTitle: 'App Services',
      partnersTitle: 'Enterprise & Partners',
      legalTitle: 'Trust & Governance',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Preferences',
      rightsReserved: 'All Rights Reserved. NEXG App International.',
      language: 'Language / Region',
      craftedWith: 'Crafted for five-star luxury hospitality',
      aboutText: 'Hospitality. Simplified. Elevating the curated delivery and private concierge experience across Kenya.',
      verticals: 'Verticals',
      fineDining: 'Fine Dining',
      spaWellness: 'Spa & Wellness',
      vipMobility: 'VIP Mobility',
      gourmetCellar: 'Gourmet Cellar',
      experiences: 'Experiences',
      partners: 'Partners',
      forMerchants: 'For Merchants',
      forCouriers: 'For Couriers',
      forProperties: 'For Properties',
      legalSupport: 'Legal & Support',
      conciergeDesk: 'Support Desk',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      safetyStandards: 'Safety Standards',
      connect: 'Connect',
      rights: '© 2026 NEXG App. All rights reserved.',
      simulatedNotice: 'Simulated Payment Router Demo (Awaiting Live Gateway Connection)',
    },
    partnerHeaders: {
      ecosystem: 'Ecosystem',
      qrTech: 'QR Tech',
      revShareCalc: 'RevShare Calc',
      integrations: 'Integrations',
      benefits: 'Benefits',
      logistics: 'Logistics',
      howItWorks: 'How It Works',
      categories: 'Categories',
      earningsCalc: 'Earnings Calc',
      fleetPerks: 'Fleet Benefits',
      standards: 'Standards',
      faq: 'Fleet FAQ',
    },
    partnersPortal: {
      merchantTitle: 'Merchant Partners',
      merchantSubtitle: 'Expand your culinary and luxury business across five-star villas and suites.',
      courierTitle: 'Elite Fleet',
      courierSubtitle: 'Deliver luxury concierge orders. Earn premium fares and tips.',
      propertiesTitle: 'For Properties & Resorts',
      propertiesSubtitle: 'Zero-CapEx in-room guest amenity platform with integrated revenue share.',
      backHome: 'Return to Guest App',
      listBusiness: 'List Your Business',
      applyFleet: 'Apply to Fleet',
      partnerNexg: 'Partner with NEXG',
      onboardingActive: 'Active',
      onboardingStatus: 'Onboarding Status',
      stepText: 'Step',
      ofText: 'of',
      nextStep: 'Next Step',
      prevStep: 'Previous',
      submitApplication: 'Submit Application',
      agreementTitle: 'Partner Service Agreement',
      agreementDesc: 'Please review terms and sign digitally below.',
      successTitle: 'Application Submitted Successfully!',
      successDesc: 'Our concierge onboarding committee will review your submission and contact you within 24 hours.',
      returnHome: 'Return to Portal Home',
      downloadSummary: 'Download Summary PDF',
      riderPortal: 'Rider Partner Portal',
      eastAfricaSecure: 'East Africa • Secure Onboarding',
      backToSite: 'Back to Site',
      activeStatus: 'Active',
    },
  },
  zh: {
  ui: {
    bookingCalendar: {
      's_07499a': 'Party / Guests',
      's_10422c': 'Local Villa Time',
      's_183a37': 'Sync Calendar',
      's_534c34': 'Next Month',
      's_71b856': 'Previous Month',
      's_79caea': 'Available Time Slots',
      's_8efff8': 'In 2 Days',
      's_aeb91b': 'Dedicated Reservation Calendar',
      's_e5366b': 'Selected Schedule',
      's_fdc2b8': 'Next Week',
    },
    cartDrawer: {
      's_11a9f0': 'Explore Menus',
      's_1fc724': 'Promo code (try NEXG20)',
      's_2303a3': 'Your cart is empty',
      's_237e47': 'Clear entire cart',
      's_2c7952': 'Simulated checkout & instant confirmation',
      's_42cb61': 'Close cart',
      's_44951e': 'Courier tip',
      's_643b96': 'Your Order Cart',
      's_733b61': 'Delivery fee',
      's_76ecba': 'Remove item',
      's_ab8546': 'Explore our curated restaurants and add artisanal dishes or concierge dining to get started.',
      's_c7085d': 'Courier Concierge Tip',
      's_d2467b': 'Your order',
      's_d2f4d4': 'Proceed to Checkout',
      's_d6ea26': 'Concierge service fee',
    },
    categories: {
      's_1a9863': 'Browse Partners',
    },
    categoryExplorerModal: {
      's_233e38': 'Click any category or subcategory to instantly browse partners',
      's_7c267a': 'View listings',
      's_7fd08b': 'Reset Catalog Filters',
      's_940323': 'Close categories',
      's_af1c10': 'Verified Merchant Partners',
      's_c7fa37': 'Try searching for another keyword or clear the search query.',
      's_c9f43c': 'Search across all 21 categories & 134 subcategories (e.g. Fine Dining, Vapes, Chauffeur, Safari)...',
      's_e37ac9': 'No matching verticals found',
      's_f4cf7c': 'Merchant Categories & Subcategories',
    },
    categoryPage: {
      's_004d7e': 'Top Rated',
      's_062888': 'Free Delivery',
      's_2cef94': 'Reset all filters',
      's_41eb8f': 'Fastest Delivery',
      's_c4baea': 'Price Level',
      's_fce284': 'No merchants found matching your filters.',
    },
    checkoutSimulatedModal: {
      's_119c2f': 'This payment is',
      's_19e2a2': 'Finalize & Place Order',
      's_3a7a99': 'Apple Pay',
      's_55e54d': 'App Delivery Instructions',
      's_635949': 'Choose Simulated Payment Method',
      's_63da07': 'Simulate Payment & Place Order',
      's_6aa79c': 'Selected Items',
      's_7db213': 'Hotel / Villa / Street Address',
      's_846466': 'Close checkout',
      's_882f46': 'Simulates instant STK push prompt directly on mobile handset.',
      's_9ad55a': 'Total Demo Amount',
      's_ac51d0': 'Cardholder Name',
      's_b79126': 'No real funds or accounts will be debited.',
      's_bac774': 'Simulated Demo Checkout',
      's_bb36a9': 'DEMO ROUTER',
      's_cecb67': 'Preloaded Demo Card',
      's_dd0a60': 'Router Demo Validated',
      's_e5297b': 'Delivery Address & Location',
      's_e569ab': 'Processing Demo Payment...',
      's_ea3289': 'Room Folio / Cash',
      's_ea4478': 'Simulates one-touch FaceID / TouchID authorization.',
      's_eb034a': 'Billed directly to your hotel master room folio upon delivery.',
      's_ee343f': 'Sandbox Router Active',
      's_fee23b': 'Merchant Partner',
    },
    consentBanner: {
      's_35c291': "全部拒绝",
      's_66cd82': 'Vidakuzi muhimu pekee huwezesha tovuti kufanya kazi. Vidakuzi vya takwimu na matangazo hubaki vimezimwa hadi uviteue, na unaweza kubadilisha chaguo hili wakati wowote.',
      's_788df5': "Cookie 选择",
      's_821d1f': "全部接受",
      's_956fa7': "保存选择",
      's_9e0cba': "Cookie 设置",
      's_da6a92': "必要的 Cookie 始终处于启用状态，其他 Cookie 均为可选项。",
      's_e7d306': "Cookie 偏好设置",
      's_f477c8': "始终启用。由于网站运行必需，因此无法关闭。",
    },
    courierOnboarding: {
      's_037e0b': 'Our compliance officers verify your submitted National ID, license, PIN, and fleet logbooks directly against NTSA registers.',
      's_03c52e': 'Guaranteed Base Salary',
      's_06c8b6': 'Verify your registered logistics enterprise. Only PDF files and scanned images up to 5MB size are accepted.',
      's_0b39f6': 'Fleet Partner',
      's_0bd62e': 'Account Number',
      's_0cb44f': 'Executive Sedan / Van',
      's_0d36d5': 'Active public third-party or comprehensive fleet cover policy certificate.',
      's_0d98d0': 'E.g. Swift Deliveries',
      's_0e3256': 'Submit official identification and transit licensing details.',
      's_0f32ec': 'Rider Record Card',
      's_1081b3': 'Full Name, Phone, ID Number, License Number, Vehicle Type, Plate Number',
      's_10f420': 'Shift & Operating Zones',
      's_14bf35': 'Ride custom NEXG-branded premium logistics vehicles, operate consistent shifts, and enjoy a stable guaranteed base salary.',
      's_156177': 'Certificate of Incorporation',
      's_17b238': 'Accepted For Fleet Provider',
      's_1805c7': 'This agreement begins immediately on approval and is valid for a period of 12 months. Either party may terminate with 7 days\' written notice, or NEXG may block platform access instantly in cases of safety breach, driving license revocation, or fraudulent behavior.',
      's_197646': 'Full Legal Name',
      's_204be3': 'E.g. operations@swiftlogistics.co.ke',
      's_2358e6': 'Independent Rider',
      's_24813d': 'E.g. Kileleshwa, Block D',
      's_26712f': 'Authorized Primary Contact Person',
      's_27538f': 'Outline your company’s transit capacities and target operating logistics zones.',
      's_27980f': 'WhatsApp Mobile Number',
      's_27c646': 'Company Office Headquarters',
      's_2952ca': 'Type Signature',
      's_2b31a3': 'E.g. A001234567Z',
      's_2cb0d8': 'Accepted & Agreed by Rider',
      's_2d6ca0': 'Vehicle Type',
      's_2dc8f1': 'E.g. Corner House, 4th Floor, Kimathi St.',
      's_2ed783': 'Return to Elite Fleet page',
      's_30b928': 'Company KRA PIN Certificate',
      's_310c80': 'Back to Couriers',
      's_312631': 'Bank Name',
      's_3174a5': 'Contact Email Address',
      's_31843b': 'Clear canvas',
      's_338cf2': 'Services & Settlement Payout',
      's_340115': 'Clear scanned copy of front and back face of your card.',
      's_34e784': 'E.g. Swift Express Logistics Ltd',
      's_34f9ae': 'Certificate of Incorporation / Reg No.',
      's_377b90': 'Authorized Dispatch Committee',
      's_37dfba': 'NTSA Driver\'s License Number',
      's_3873df': 'E.g. DL-XXXXXX',
      's_3af714': 'No active couriers added yet',
      's_3ba957': 'E.g. Nairobi',
      's_3bfd88': 'KRA PIN Number',
      's_3c3541': 'Consolidated Business payout',
      's_3c774b': 'Carry VIP guests to properties',
      's_3cc4fd': 'NEXG Provides Vehicle',
      's_3ce5aa': 'Emergency Contact Person',
      's_41d914': 'Choose the expiry date',
      's_41fe24': 'Draw digital signature with finger or pointer',
      's_430404': 'Remove Card',
      's_44fe57': 'Emergency Mobile Phone',
      's_464dfd': 'We declare absolute compliance with Kenyan corporate regulations, active tax filings, and legal road safety acts.',
      's_4979be': 'We certify that all couriers listed in our squad profiles hold valid, unexpired NTSA driving licenses and clean background clearance certifications.',
      's_4c7486': 'Corporate Job Title',
      's_4c987a': 'Authorized Officer Full Name',
      's_4d1c2f': 'Structured Shift schedules',
      's_4ff862': 'E.g. 4',
      's_50d865': 'Upload crisp clear photo snapshots or PDF files under 5MB size limit.',
      's_5104d5': 'Preferred Operating Area Zone',
      's_51dacf': 'WhatsApp Number',
      's_53d718': 'The Fleet Provider represents and warrants that all couriers and motorbikes comply with roadworthy rules, hold comprehensive insurance certifications, and observe Kenya\'s Data Protection Act 2019 standards.',
      's_55537f': 'Vehicle Registration details',
      's_574f02': 'Next Step',
      's_587649': 'Official KRA Pin certification document page from iTax portal.',
      's_5920ae': 'You are applying for a scheduled, salaried position. NEXG provides custom branded bikes, gear, and fuel budgets. Below, you will also designate your operational preferences.',
      's_5a833b': 'Residential Address',
      's_5b5250': 'Fleet Partner Business Profile',
      's_5cfa43': 'NTSA Driving License',
      's_5f5518': 'Drive your own motorcycle or scooter, set your flexible calendar hours, and take commissions per successfully completed errand.',
      's_63a113': 'Total Registered Vehicles',
      's_64346b': 'Full Name',
      's_6790f2': 'Corporate Bank Name',
      's_692fe8': 'E.g. P051234567Z',
      's_6b3d6a': 'Deliver premium retail items',
      's_6f9c91': 'E.g. +254 711...',
      's_70abeb': 'Bank Settlement Transfer',
      's_714406': 'Configure your legal registered business details for logistics partnerships.',
      's_717eb1': 'Company Account Title',
      's_71c904': 'NEXG APP LIMITED',
      's_71ebbb': 'E.g. Red Honda CB125F (Year 2023)',
      's_71f6e3': 'Register Active Couriers Squad',
      's_72a587': 'Board Operations Committee',
      's_74955f': 'E.g. Westlands',
      's_76af1d': 'E.g. 15',
      's_77522e': 'NEXT STEPS IN OUR VERIFICATION TIMELINE',
      's_79865b': 'Preferred Working Shift',
      's_7cf2e1': 'Alternative Contact Phone',
      's_7d5f6e': 'Unlock premier delivery earnings, tailored branding, and unmatched support in Kenya’s luxury hospitality ecosystem.',
      's_7d8667': 'Plate Number',
      's_81db77': 'Years in Logistics Sector',
      's_827c49': 'Account Holder Legal Name',
      's_828ade': 'Vip App',
      's_831dc7': 'KRA PIN Confirmation Certificate',
      's_86d4ca': 'For NEXG App',
      's_8bb6da': 'E.g. 12345678',
      's_8d5d4c': 'Company Business Verification Documents',
      's_8e203d': 'Handle high-end guest requests',
      's_8f912f': 'E.g. CPR/2018/12345',
      's_903d8d': 'Execute Partnership Agreement Contract',
      's_913798': 'Click Add Rider Card above or upload your riders spreadsheet via CSV bulk import.',
      's_93457d': 'Fleet Operational Scale & Coverage',
      's_93e220': 'Corporate Fleet Partner logistics Framework',
      's_9691d0': 'ONBOARDING PROFILE SUMMARY',
      's_984805': 'Operating Counties & Estates Coverage',
      's_99dc14': 'Pending Compliance Review',
      's_9d159c': 'Direct Mobile Number',
      's_a0094a': 'Payout Method',
      's_a1524d': 'E.g. 12001234567',
      's_a1c4fe': 'E.g. +254 700 111 222',
      's_a221a1': 'Upon document clearance, you\'ll receive a WhatsApp invitation to join our premium standard customer service and hospitality training.',
      's_a40d60': 'Premium Commission Payout',
      's_a620a5': 'Official business registration certificate page issued by the Registrar of Companies.',
      's_a7c94e': 'NEXG agrees to compile and settle client order payments to the Fleet Provider’s registered bank account weekly on Mondays, less a platform operations commission fee of',
      's_a85feb': 'Your premium motorbike is provided by NEXG. You do not need to register a personal motorbike logbook or license plate here.',
      's_a8caa4': 'Add individual active riders to your partnership ledger.',
      's_aafa84': 'Active Vehicle types represented in Fleet',
      's_ac26fd': 'Submit Portfolio Agreement',
      's_ad7df6': 'Motorcycle / Scooter',
      's_aed4fc': 'Join the Elite NEXG Rider Fleet',
      's_aef6a9': 'National ID / Passport Number',
      's_af7bb7': 'Signatory Director\'s National ID',
      's_af8a4e': 'The Fleet Provider certifies that they actively manage and pay a squad of',
      's_b026ba': 'City HQ Location',
      's_b09e88': 'Draw Signature',
      's_b21f30': 'ID Number',
      's_b2e0a8': 'Driver\'s License Expiry Date *',
      's_b5015c': 'List all cities and estates where your fleet currently has active coverage. E.g. Nairobi CBD, Westlands, Kilimani, Mombasa, Diani, etc.',
      's_b5c479': 'NEXG Dedicated Rider',
      's_b724e7': 'Print Agreement Document',
      's_b984fa': 'Import CSV Spreadsheet',
      's_b9d00c': 'This contract is binding for a term of 12 months. Either partner may exit the frame by providing 14 days\' written notice to the other party.',
      's_bc5303': 'Add Rider Card',
      's_bf24cb': 'Name exactly as printed on legal ID card',
      's_c1ecb3': 'Package Delivery',
      's_c33c9b': 'DL Number',
      's_c59900': 'E.g. KMCA 123A',
      's_c7a051': 'We declare that our organization maintains comprehensive third-party logistics insurance and active public liability coverage across all active fleet operators.',
      's_c85d99': 'Proof of ownership and active public transit insurance coverage.',
      's_c8708a': 'Company Legal Name',
      's_c8bc71': 'Corporate Bank Settlement Account',
      's_c8ed49': 'Identification & Vehicle Setup',
      's_ca5690': 'Download Standard CSV Template',
      's_cabacd': 'NEXG Operations Admin',
      's_cdec1f': 'Both sides of your active, unexpired logistics driver license.',
      's_d101b7': 'Onboard your registered Kenyan logistics agency and entire courier squad. Bulk upload riders and manage team-level settlements.',
      's_d5184b': 'Own Vehicle required',
      's_d5e54c': 'Commercial Fleet Insurance Policy',
      's_d64903': 'NEXG remits compiled client transport payout settlements directly to your corporate account weekly on Mondays.',
      's_d66864': 'Flexible Shifts',
      's_d9863a': 'E.g. Fleet Manager',
      's_db3b79': 'Account Name',
      's_dca3fc': 'E.g. Westlands, Kilimani, Lavington',
      's_ddb4d1': 'E.g. Equity Bank',
      's_de744b': 'E.g. Mary Jane',
      's_e04a0d': 'Payout Settlement Configurations',
      's_e07446': 'Review pre-filled contract agreement clauses and apply your electronic signature.',
      's_e0934e': 'Date of Birth *',
      's_e12ee9': 'Preferred Transit Vehicle Assigned',
      's_e15c6c': 'Trading Name / Brand Name',
      's_e16a80': 'Document Verification Uploads',
      's_e1c6ae': 'Bulk CSV Squad Import',
      's_e1fe05': 'E.g. Albert Mwangi',
      's_e21ec5': 'Vehicle Model & Color',
      's_e387b2': 'Business KRA PIN',
      's_e3ca9b': 'E.g. John Kamau Maina',
      's_e4c574': 'E.g. +254 711 000 000',
      's_e7710e': 'Typed Electronic Signature preview',
      's_e7cfff': 'Authorized Signature Panel',
      's_e90701': 'Select Gender',
      's_eb6915': 'Fleet Integrity Declarations',
      's_ec9a3f': 'Estate Area / Street',
      's_ecd675': 'Vehicle Logbook & Third-Party Insurance',
      's_eeec98': 'Import CSV',
      's_ef8482': 'Choose Your Partnership model',
      's_efbb4c': 'E.g. Spouse / Parent',
      's_f3a211': 'E.g. +254 700 987 654',
      's_f4afb4': 'Choose your date of birth',
      's_f65568': 'E.g. +254 712 345 678',
      's_f6da6f': 'Personal Profile Details',
      's_f71ebc': 'E.g. John Kamau',
      's_f954ab': 'NEXG Fleet Operations',
      's_f9f8d5': 'Select the model that aligns with your assets. We have personalized contracts and onboarding checklist steps for each path.',
      's_fa0cdb': 'Total Active Riders',
      's_fbbe43': 'Configure how you receive settlements and who to contact in emergencies.',
      's_fca1ec': 'Ensure your details correspond exactly with your National Identification Document.',
      's_feb1b4': 'ID of the legal officer executing the Fleet Partnership Agreement.',
      's_febf86': 'Rider agrees to strictly wear the customized NEXG apparel on duty, maintain exemplary clean vehicle hygiene, arrive within specified time slots, and respect international hospitality guests\' absolute privacy. Failure to maintain a minimum 4.0/5.0 star rating may result in temporary profile deactivation.',
    },
    curatedNairobiWorlds: {
      's_15a714': 'Dynamic cross-category plans tailored to your moment, occasion & time of day',
      's_18a51d': 'Full Experience Builder',
      's_41dd82': 'Curated Nairobi Worlds',
      's_52c035': 'NEXG Experience Orchestrator',
      's_8abe87': 'Explore Offerings in Main Feed',
      's_c2018d': 'Contextual Experience Hub',
      's_ecc198': 'Click step to explore offerings',
      's_fe8da0': 'Nairobi Curated',
    },
    databaseSqlModal: {
      's_baaf3a': 'PostgreSQL Database Scripts',
    },
    dateTimeField: {
      's_46a299': 'Previous month',
      's_7ecc8b': 'Choose a year',
      's_8abf7c': 'Next month',
    },
    discoveryScreen: {
      's_030851': 'Merchant categories',
      's_0b7ee2': 'All verticals',
      's_176135': 'The API may not be running. Start it with',
      's_412226': 'Clear filters',
      's_67300d': 'Clear search',
      's_8344a6': 'Search merchants',
      's_a3c57f': 'No merchants found',
      's_dfe60c': 'Load more',
      's_f4d948': 'Search restaurants, spa, safaris, champagne, chauffeur, pharmacy...',
    },
    dishCustomizerModal: {
      's_052b34': 'Guest Satisfaction',
      's_062e79': 'Increase quantity',
      's_1c711d': 'Verified Diners Only',
      's_2db328': 'Any preferences? e.g. Extra dressing on side, cutlery needed...',
      's_492026': 'Add to Order',
      's_594a3d': 'Share what made this dish memorable...',
      's_6c02ab': 'Decrease quantity',
      's_70d3a5': 'Close modal',
      's_84ab4b': 'Submit Verified Review',
      's_9c0406': 'Suite / Villa (e.g. Penthouse 402)',
      's_a196bb': 'Customize & Options',
      's_bfae0e': 'Your Name (e.g. Eleanor V.)',
      's_d0fac0': 'Leave Your Dining Review',
      's_ece1f0': 'Special Kitchen Instructions',
    },
    dockedSearchBar: {
      's_67300d': 'Clear search',
    },
    experiences: {
      's_057742': 'Curated Experience Hosts & Outfitters',
      's_14c995': 'Book Date',
      's_574a76': 'Book Activity',
      's_63ae7c': 'Date & Time',
      's_6568e5': 'Your booking with',
      's_96ebfb': 'Search hosts, Maasai Mara, Giraffe Centre, cinema, safari...',
      's_9fda6b': 'Back to all Outfitters',
      's_a1e9f9': '浏览首页',
      's_ad3a34': 'Private Safaris, Aerial Tours & Cultural Ateliers',
      's_cebc44': 'Choose an expert outfitter to browse hot-air balloon flights over the Mara, private giraffe conservation sanctuaries, and master artisan ateliers.',
      's_d29299': 'Bespoke Concierge Expeditions',
      's_eb9e1e': 'Confirm Booking',
      's_f6e8ce': 'Experience Reservation',
    },
    floatingCartBar: {
      's_f40d71': 'View Order',
    },
    forCouriers: {
      's_06816c': 'Apply to Drive',
      's_08c1c3': 'We provide access to high-quality vehicle maintenance programs, comprehensive courier insurance plans, and dedicated dispatch teams assisting you 24/7.',
      's_0c343a': '在线申请',
      's_0c8a9a': 'Terms of Service',
      's_0e840b': 'Pocket High Tips',
      's_110158': 'Help Center',
      's_153ab5': 'Idle Reduction',
      's_18414d': '精英车队',
      's_1bedd8': 'Ambassadors utilizing our suite-specific integrated routing enjoy significantly higher success ratings and earn double the average industry tips.',
      's_1d2be9': 'Safety Guidelines',
      's_209f63': 'Average Earnings Growth',
      's_22d1d3': 'Once you submit your application online, our onboarding team reviews documents within 48 hours. If qualified, you\'ll be invited for a brief physical assessment and standard white-glove training before your account goes active.',
      's_2a7274': 'Submit your vehicle registration and documents online in under 5 minutes through our secure, mobile-friendly onboarding portal.',
      's_2bf27f': '第 01 步',
      's_2d816d': 'Career Advancement',
      's_2e6151': 'FLEET REQUIREMENTS',
      's_2ed1ed': 'Premium Payouts for Professional Ambassadors.',
      's_33b4c6': 'Join the Elite Fleet',
      's_3500ab': 'Join a community built on premium status and mutual respect. We support your career path and help you develop unmatched service skills.',
      's_355ac2': 'Deliveries per Day',
      's_38769a': '物业合作',
      's_38df83': 'Estimate Earnings',
      's_39bc68': 'Your Vehicle Type',
      's_41493f': 'Join the Elite',
      's_42475b': 'Maintain exceptional ratings and receive daily performance multipliers and exclusive priority dispatcher pairing.',
      's_440245': 'The NEXG Driver App',
      's_45b640': 'Go online in the driver app, navigate to hot premium spots, complete high-end orders, and watch your mobile wallet balance swell.',
      's_4748c1': 'Receive clear, automated settlements straight to your bank or mobile wallet without delay, backed by detailed electronic statements.',
      's_4c36e1': 'SETUP TIMELINE',
      's_4d5b64': 'Ambassador Rating',
      's_4d81b2': '第 03 步',
      's_4f555f': 'Track your daily performance, optimize your delivery times, and master Swahili & English hospitality tips with our smart companion analytics dashboard.',
      's_5150fd': 'Priority Routing Tech',
      's_52a6f3': '合作伙伴',
      's_530246': 'Guaranteed Weekly Payouts',
      's_53cdfb': 'DATA INTELLIGENCE',
      's_54c4b5': 'Exceptional Presentation',
      's_5b8964': 'Guest Rating Profiles',
      's_5ce9fd': 'Fast Verification',
      's_5e7925': 'Our professional partner compliance team validates your records and issues a secure orientation invitation within 48 hours.',
      's_653ccb': 'We currently support major high-end neighborhoods and coastal luxury zones across Nairobi, Mombasa, and Diani, expanding quickly to other East African metropolitan areas.',
      's_677710': 'Route Efficiency Score',
      's_6bde0a': 'Apply Online Now',
      's_6d1c48': 'Earn stars and secure exclusive bonuses. Build private, anonymous reviews that reinforce your stellar reputation with premium hotels.',
      's_75dde0': 'Return to Guest App',
      's_765f2b': 'TRANSPARENT EARNINGS',
      's_777b12': 'Ambassador delivering gourmet meals',
      's_78df83': 'Powerful Analytics for Elite Drivers',
      's_7e32e7': 'Quick online onboarding. Submit details, attend orientation, retrieve your custom elite starter kit, and take your first order in under 48 hours.',
      's_7f255f': 'Deliver high-end products and culinary creations with meticulous care. Be dressed in custom-designed NEXG apparel to reflect elite standards.',
      's_8049d9': 'Weekly Payout Settlements',
      's_85cf78': 'No waiting for week-ends. Complete premium tasks and trigger instant payouts directly into your mobile wallet.',
      's_89bdbf': 'Elevating premium hospitality across East Africa with integrated, contactless concierge ecosystems.',
      's_8b1193': 'Understand your daily yields. Monitor peak areas, identify high-tipping zones, and learn the best hours to go online.',
      's_928714': 'Collect Starter Kit',
      's_933192': 'What it Takes to Be a NEXG Ambassador.',
      's_93a5bc': 'Exec Car',
      's_93fef0': 'Empowered Scheduling',
      's_95e986': 'Take complete control over your working hours. Plan your deliveries around peak fine-dining periods to lock in dynamic high fares.',
      's_97b846': 'Gain exclusive professional training in hospitality service, client management, and path leadership with certificates of excellence.',
      's_981b01': 'Premium Fleet Support',
      's_9ad0cc': 'Contact Us',
      's_9b1690': 'Apply to Fleet',
      's_9d3f52': 'Our advanced routing algorithms guide you efficiently to high-value destinations, minimizing idle mileage and maximizing deliveries per hour.',
      's_9db108': 'Privacy Policy',
      's_a08321': 'Redefining Delivery.',
      's_a1e9f9': 'Explore Home',
      's_a7acb1': 'Work according to your personal schedule. Take shifts during peak fine-dining hours for maximized yield.',
      's_a9577d': 'Secure Site',
      's_ad6c0d': 'KNOWLEDGE BASE',
      's_aed5c5': 'Must possess a clean driving record, valid local driver\'s license for your specified vehicle, and active comprehensive third-party insurance coverage.',
      's_b53080': 'Courier Partner FAQs',
      's_b74c4e': '切换主题',
      's_bc89aa': 'Empowered Flexibility',
      's_befa37': 'Ambassador scanning the driver app',
      's_c10fec': 'Flawless Modern Vehicle',
      's_c18810': 'Valid Documents & Licenses',
      's_c24cae': '第 02 步',
      's_c38c49': 'Elite Rank Status',
      's_c71f96': 'Weekly Target Reached',
      's_c88176': 'Access culinary deliveries, spa wellness packages, and executive courier jobs cleanly integrated under a single, highly intuitive screen.',
      's_c887b9': 'About Us',
      's_ce60db': 'Own Your Earnings.',
      's_ce7472': '返回首页',
      's_d44881': 'Couriers Hero Background',
      's_d781b4': 'Operational Mapping',
      's_df9144': 'ELITE STANDARDS',
      's_e10068': 'Based on an average base fee of',
      's_e18d8e': 'Courier Earnings Estimator',
      's_e3a7a2': 'Direct payments made straight to your account every single week, with zero hidden fees.',
      's_e3b925': '第 04 步',
      's_e6e178': 'Cookie Policy',
      's_e72e94': 'Earnings Analytics',
      's_eb35f1': 'Start your application today. Complete the secure onboarding questions and step into a new tier of professional independence and respect.',
      's_ec3c35': 'Stay updated with premier hospitality tips and trends.',
      's_eeb176': 'To guarantee top status, NEXG provides all approved couriers with premium tailored jackets, clean polo shirts, and custom-insulated delivery bags. Black trousers and clean black shoes are required on duty.',
      's_f370c7': 'Our app guides you right up to the designated suite or property zone, avoiding lobby confusion and ensuring frictionless drop-offs.',
      's_f582d4': 'Our dispatch systems minimize your empty miles. Pre-book orders or follow integrated corridors to stack high-paying jobs in a row.',
      's_f6e64a': 'Average Tip per Delivery',
      's_fbe3b3': 'Premium Integrated Hub',
      's_fcf600': 'Retrieve your tailored NEXG jackets, insulated food packs, smartphone bracket, and secure driver login credentials.',
      's_ff2382': 'Couriers Hero Daylight Background',
    },
    forMerchants: {
      's_032a19': '我们的专业策展专家会录入您的商品、打造精美视觉，并优化布局，以便直接用于无接触宾客展示。',
      's_0c343a': 'Apply Online',
      's_0eaa2f': '就在他们所在之处。',
      's_118503': '商户页日间主视觉背景',
      's_1600e2': '申请加入 NEXG',
      's_18414d': 'Elite Fleet',
      's_2bf27f': 'STEP 01',
      's_2f5b37': '商户支持',
      's_38769a': 'For Properties',
      's_3f3d89': '无需为整合烦恼。提交您的菜单或目录，让我们将您的门户数字化，48 小时内即可获得精选本地销售。',
      's_4d81b2': 'STEP 03',
      's_52a6f3': 'For Partners',
      's_540349': '自动化收入',
      's_591721': '更高的平均客单价',
      's_673bf7': '准时收款，始终如一。宾客完成结账后，自动且安全的商户款项会即时汇入您的银行账户。',
      's_750959': '申请将由我们的策展团队在 24 小时内审核，以确保平台整体维持高品质与服务标准。',
      's_771412': '商户为何选择 NEXG',
      's_7cb113': '倍增销量',
      's_80b451': '即时分账结算',
      's_81df05': '稳定订单',
      's_85feef': '高端曝光',
      's_891482': '从数字菜单排版到自定义结账链接，一切由我们处理。您完全无需进行任何技术设置。',
      's_89a9da': '通过我们流畅直观的 2 分钟入驻表单，提交您的高级餐饮菜单、奢华水疗项目或租赁目录。',
      's_916b2f': '数字化整合',
      's_a1e9f9': 'Explore Home',
      's_a2e8c7': '接收客房订单',
      's_a92592': '入驻流程',
      's_aa32fa': '开始入驻',
      's_abafb4': '请仔细备好包裹。专业的 NEXG 骑手会上门取件、完成配送，并自动保障结算。',
      's_ae23a7': '让订单顺畅运行。我们的主动支持礼宾团队会实时监控配送，并协助处理特殊客房需求。',
      's_b74c4e': 'Toggle Theme',
      's_ba7223': '取件佣金',
      's_c0228a': '触达客户。',
      's_c24cae': 'STEP 02',
      's_c75030': '商户页主视觉背景',
      's_c89f38': '与 NEXG App 合作，直接在高端奢华物业内为宾客提供服务。我们提供白手套级物流、自动化结算，并与您现有团队无缝整合。',
      's_ce7472': 'Back to Home',
      's_ce9fe6': '无需担心运输。我们经过严格审核的专业骑手车队会取走您的包裹，并以精英标准完成配送。',
      's_d6626f': '零阻力设置',
      's_da08fb': '无缝结算',
      's_def7cc': '专属支持',
      's_e3b925': 'STEP 04',
      's_e56df8': '为何与我们合作',
      's_e6a013': '商户条款',
      's_e9cbdf': '已认证物业',
      's_f6538e': '触达高净值宾客、游客与商务旅客，他们正在订购美食、个人用品或水疗服务。',
      's_f6e1bd': '在高端酒店客房目录、高可见度的床头二维码卡片以及数字礼宾网页应用中占据专属位置。',
      's_faae3e': '宾客扫描客房二维码后，订单会直接流入您的商户后台，并配有实时声音与视觉系统通知。',
      's_fe1a29': '联系客服',
    },
    forProperties: {
      's_0293af': 'Properties Hero Background',
      's_052b34': 'Guest Satisfaction',
      's_061f53': 'Curated local menus',
      's_06fb24': 'Integrate seamless, world-class concierge services into your luxury rentals and hotels. Empower guests to order gourmet food, book organic spa treatments, and request private transport with a single, contactless scan.',
      's_0a3693': 'Instant access, absolutely zero apps required',
      's_0c8a9a': 'Terms of Service',
      's_0d3b7b': 'Predict high-demand hours to allocate room cleaning, butler services, or external partner delivery drivers with supreme efficiency.',
      's_0e5ae2': 'Unified Service Hub',
      's_110158': 'Help Center',
      's_110820': 'Join hundreds of high-end resorts, boutique hotels, and luxury Airbnb hosts across East Africa that are boosting guest satisfaction and building zero-cost revenue.',
      's_176079': 'Preference Profiles',
      's_17d67c': 'Earnings Estimator',
      's_182ad0': 'Secure automated checkouts, verified premier concierge merchants, and licensed professional couriers guarantee safety and guest peace of mind.',
      's_18414d': 'Elite Fleet',
      's_1be9e5': 'Every QR code is uniquely tied to the guest suite, meaning food deliveries, room cleanings, or requested towels find guests exactly where they are.',
      's_1d2be9': 'Safety Guidelines',
      's_21f4bb': 'Happy Guests',
      's_25096d': 'Upfront Integration Cost',
      's_271358': 'Properties utilizing NEXG Contactless QR systems experience a massive increase in service engagement compared to conventional physical folders.',
      's_29b967': 'Properties CTA Sunset Background',
      's_2bf27f': 'STEP 01',
      's_31c559': 'Elevate Guest Experiences.',
      's_338ed9': 'Earn More Income',
      's_341a50': 'NEXG builds privacy-compliant guest preference profiles to help your staff pre-empt needs before they are even spoken out loud.',
      's_38769a': 'For Properties',
      's_3b6c18': 'Service Response Index',
      's_40c759': 'Average Occupancy Rate',
      's_4216f1': 'Trusted & Safe',
      's_46f477': 'Guests scan, order, and pay instantly. NEXG handles all fulfillment, depositing automatic commission shares to your dashboard.',
      's_49f179': 'We Handle Everything',
      's_4c36e1': 'SETUP TIMELINE',
      's_4d2dec': 'Local Adventures',
      's_4d81b2': 'STEP 03',
      's_4f7049': 'Estimated Monthly Share',
      's_4fdd58': 'Order Conversion Rate',
      's_52a6f3': 'For Partners',
      's_534294': 'We supply custom-crafted physical suite-specific QR cards. Place them in your room directories or high-visibility bedside tables.',
      's_53cdfb': 'DATA INTELLIGENCE',
      's_589ee1': 'Configure & Customise',
      's_5bfbb7': 'The QR Advantage',
      's_5fbc63': 'Unlock Property Potential.',
      's_70a8da': 'Stand Out',
      's_73ba7f': 'Chauffeurs & rentals',
      's_75dde0': 'Return to Guest App',
      's_785c45': 'Powerful Analytics for Modern Managers',
      's_7a1f3a': 'Position your properties as elite, technologically forward luxury destinations. Set a standard of hospitality others can\'t match.',
      's_7b1758': 'Private Cab & Car Hire shares',
      's_7bf908': 'Partner Onboarding',
      's_7c6eec': 'Transform guest behavior into highly actionable insights. Track ordering trends, optimize your staffing, and refine property offerings with real-time analytics.',
      's_7ee992': 'View Demo Video',
      's_818f94': 'Clear real-time transparency audit trail',
      's_8249e7': 'Food & Dining referrals',
      's_8332c9': 'Inventory Speed',
      's_872061': 'Deploy QR Displays',
      's_89bdbf': 'Elevating premium hospitality across East Africa with integrated, contactless concierge ecosystems.',
      's_8c288d': 'Submit your property and suite list online. Our concierge activation specialists verify your layout to launch your space.',
      's_8c8458': 'Why Hosts Choose NEXG',
      's_8d365a': 'Properties Daylight Hero Background',
      's_8e8592': 'Bespoke Tours & Safaris',
      's_8fe3e8': 'Apply & Partner',
      's_9ad0cc': 'Contact Us',
      's_9db108': 'Privacy Policy',
      's_9fd2f3': 'Stop leaving incremental hospitality revenue on the table. Our mutual commission-sharing model turns every guest service interaction into a direct revenue flow for your property, even when fulfilled entirely by trusted third-party merchants.',
      's_a1e9f9': 'Explore Home',
      's_a2cb3c': 'Guests simply point their camera and browse. No logins, no tedious app downloads, just premier high-end service in a couple of seconds.',
      's_a2f3a7': 'Enhanced Experience',
      's_a3fb7a': 'Fine Dining',
      's_a5d6a1': 'Zero integration overhead. Complete hotel setup, display delivery, and automatic digital catalog activation in under 48 hours.',
      's_a62509': 'REVENUE GENERATION',
      's_a9577d': 'Secure Site',
      's_a969aa': 'Safaris & excursions',
      's_a97bcc': 'Unlock a hands-off, zero-effort passive revenue stream by receiving high commission splits from every guest meal, ride, or tour booked.',
      's_aaa399': 'Passive Commissions',
      's_b74c4e': 'Toggle Theme',
      's_c24cae': 'STEP 02',
      's_c50b8f': 'Fully automated payouts and digital reporting',
      's_c5bb5d': 'Average Order Growth',
      's_c86934': 'Total Rooms / Suites',
      's_c887b9': 'About Us',
      's_c9bc84': 'Luxury Transport',
      's_cd4fe8': 'Partner with NEXG',
      's_ce7472': 'Back to Home',
      's_d08ccb': 'Zero Friction Interface',
      's_d15371': 'Delighted guests leave glowing feedback. Maximize your rating scores and booking ranks across Airbnb, Booking, and Expedia.',
      's_d178f4': 'Guest Habit Tracking',
      's_d300d6': 'Better Reviews',
      's_d5d3ea': 'We integrate premier local partner cuisines, spa offerings, and chauffeur fleets into a single, seamless brand-matching portal.',
      's_d8481d': 'Wellness & Spa',
      's_d887cc': 'Understand exactly what your guests prefer. Track peak booking periods, top fine dining cravings, and late-night requests.',
      's_e09921': 'Operational Optimization',
      's_e3b925': 'STEP 04',
      's_e56df8': 'WHY PARTNER WITH US',
      's_e6e178': 'Cookie Policy',
      's_e7f7ee': 'More Bookings',
      's_e87389': 'Loyalty Return Intent',
      's_ea763f': 'Apply for Partnership',
      's_ec3c35': 'Stay updated with premier hospitality tips and trends.',
      's_ee7b88': 'We seamlessly integrate previously fragmented premium local merchants into an elegant singular user experience reflecting your property’s status.',
      's_f04a9d': 'Absolutely zero operational burden for you. From partner restaurant execution to vetted courier logistics, NEXG does all the heavy lifting.',
      's_f59c46': 'Monetize Every Single Stay.',
      's_f77be3': 'Luxury suite with guest scanning QR code',
      's_f90548': 'Deliver unmatched, instant room service, organic spa appointments, and curated local safaris at the simple scan of a finger.',
      's_f907f8': 'One Elite App. Infinite Services.',
      's_fa3fc3': 'Average App Spend per Stay',
      's_fe3f95': 'THE ECOSYSTEM',
    },
    googleReviewsModal: {
      's_0d75a8': 'Google Maps Pin',
      's_273f6f': 'No Google reviews match your selected filter.',
      's_3ea133': 'Verified direct contacts & socials',
      's_6913b8': 'Search reviews for dishes, ambiance, speed...',
      's_6a6eaf': 'Filter by Stars',
      's_6bce42': 'Verified Aspect Scores',
      's_aaf427': 'Atmosphere & Reliability',
      's_ba9553': 'Quality & Execution',
      's_bd9554': 'Reviews synced in real-time with Google Places API',
      's_c34ae8': 'Aspect data collected via Google Places API',
      's_cbac3e': 'App Service',
      's_d45c4f': 'Official Portal',
      's_d6f49f': 'Verified Google Reviews',
    },
    groceriesPage: {
      's_160a42': 'Back to all Purveyors',
      's_340a24': 'Gourmet Cellar & Purveyors',
      's_48028b': 'Artisanal Cellar, Caviar & Fromagerie',
      's_504097': 'Fine Cellar & Epicurean Purveyors',
      's_7447ef': 'Search purveyors, caviar, Dom Pérignon, Bellota, truffles...',
      's_828ad2': 'Insulated Cold Packaging',
      's_a1e9f9': 'Explore Home',
      's_dcc1fb': 'Select Item',
    },
    header: {
      's_64f892': 'Toggle Light/Dark Theme',
      's_7abd6c': 'View Cart',
    },
    hero: {
      's_67300d': 'Clear search',
      's_7ecda2': "夜色中的奢华顶层公寓晚宴与城市天际线",
      's_c75a68': "阳光下的奢华顶层公寓无边泳池与城市天际线",
      's_ece6e2': "夜色中的奢华套房移动版",
    },
    hostOnboarding: {
      's_00679c': '由谁执行？',
      's_013237': '使用我的位置',
      's_0302c0': '前台、门禁密码流程、安保处、房东联系方式等。',
      's_0d3b1e': '房东门户',
      's_10599c': '物业名称',
      's_10a49a': '添加空间 / 房型',
      's_120c32': '物业内如何识别宾客身份？',
      's_12e078': '名称 / 标签',
      's_1596ef': '将您的物业接入 NEXG。',
      's_193de6': '您的房东申请：',
      's_205866': '地标、门禁说明、楼栋名称、入口等。',
      's_20687f': '结算账户',
      's_25916d': '价格（可选）',
      's_25e7e1': '向宾客介绍物业',
      's_272c68': '物业特色',
      's_292d45': '宾客请求示例',
      's_2bbda0': '致 NEXG App Limited',
      's_33becf': '您可以提交验证了。',
      's_369c34': '物业合作方',
      's_3cc2c7': '签名板',
      's_415e74': '可接待宾客数',
      's_421a0f': '简要描述物业、氛围及其独特之处……',
      's_486ffa': '授权代表',
      's_49e09b': '税务 / 定价设置',
      's_4a9200': '物业 / 经营许可证',
      's_4e17c4': '授权代表在下方签署，即确认所提交信息准确无误，并接受入驻过程中展示的适用 NEXG 房东合作条款。',
      's_58eafa': '请求的通常处理时长',
      's_616ace': '法律 / 运营主体',
      's_62a764': '如适用',
      's_6372ac': '房东入驻',
      's_67745b': '再提交一份',
      's_692b50': '楼栋、街道或道路',
      's_7013c7': '房东仍须负责物业服务的运营、安全、许可、人员配置、可用性、定价与履约。NEXG 可依约定配置协调宾客请求、交易及相关流程。',
      's_75d65e': '您的进度已保存在本设备上。',
      's_773613': '客房 / 单元数',
      's_782667': '房东设置',
      's_7af122': '点击地图以设定物业的精确位置。',
      's_7b12e1': '添加您团队目前实际处理的请求。',
      's_7bba35': '物业封面图片',
      's_810878': '请告诉我们物业有哪些设施、宾客可使用什么，以及您的团队如何运作。我们将据此构建您的物业档案与宾客体验。',
      's_82c7e7': '返回房东门户',
      's_849305': '签署方式',
      's_86adcf': '开业年份',
      's_893bd7': '授权签署人姓名',
      's_897c71': '清除签名',
      's_8ad7ea': '物业类型',
      's_8dc8f7': '您希望 NEXG 帮您向宾客展示什么？',
      's_8e3c7a': '网站 / 预订页面',
      's_924da1': '描述您的物业类型',
      's_93cfd5': '这是什么类型的物业？',
      's_9550a5': '可用的部门 / 团队',
      's_99d32f': '返回房东门户',
      's_9d617c': '宾客可以使用或请求什么？',
      's_a2a1b1': '房东同意维护准确的物业信息与合理的服务可用性，并就可能影响宾客履约的重大变更通知 NEXG。',
      's_a68df4': '入住 / 抵达说明',
      's_a6d2ea': '房东确认，就其所知，所提供的物业、运营模式、宾客可用空间及服务信息均准确无误，且其有权提供该等信息。',
      's_a8dc5c': '物业包含哪些设施？',
      's_aa1d9b': '您希望宾客为什么付费？',
      's_ae7f40': '退房时间',
      's_b45dc8': '任何目前难以展示、预订、购买或让宾客轻松提出的项目……',
      's_b501d3': '请求 / 服务',
      's_b50578': '上传方形标志',
      's_b5508b': '物业设置',
      's_be3ecd': '账户持有人姓名',
      's_bf72f7': '结算信息应在启用前核实。请勿在此表单中填写银行卡或钱包凭证。',
      's_c0b7d7': '在地图上标记物业位置',
      's_c250a9': '物业通行',
      's_c36127': '保存 / 打印',
      's_ca1948': '房东专用',
      's_ca9b4a': '宾客应如何找到您？',
      's_cde9a5': '可选备注、设施或通行说明',
      's_ce9840': '所提交信息可能用于入驻、验证、运营、支持、结算及宾客体验等目的进行审核。启用前可能要求补充验证。',
      's_d1d7c9': '法定全名',
      's_d90fdd': '运营模式',
      's_e400b7': '目前宾客请求如何传达给您的团队？',
      's_e45952': '应由谁接收 NEXG 请求？',
      's_e4cee9': '申请已收到',
      's_e61a08': 'M-PESA 商户号 / 缴费号',
      's_e9c696': '您是否要入驻多处物业？',
      's_eb7eb7': '选择文件',
      's_ecc61a': '请先填写标出的字段再继续。',
      's_edbfdd': '物业标志',
      's_f0ac0a': '待验证',
      's_f548ec': '营业执照 / 注册文件',
      's_f71497': '入住时间',
      's_faea7e': 'NEXG App Limited',
      's_fbd2e5': '注册公司或经营名称',
      's_ff1835': 'NEXG 运营团队',
    },
    languageSwitcher: {
      's_03e64a': "更改语言（英语、中文、斯瓦希里语、阿拉伯语）",
      's_99547d': "选择语言和地区",
      's_b8cc8e': "语言选择器",
    },
    merchantAdCarousel: {
      's_297522': 'Sponsored partner offers',
      's_2d4e52': 'PARTNER SPOTLIGHT',
      's_3340de': 'Exclusive host and verified partner privileges',
      's_430fac': 'Enable location to see trending offerings near you',
    },
    merchantCard: {
      's_3beea0': 'Save to favorites',
      's_960d55': 'Popular offerings',
    },
    merchantItemModal: {
      's_062e79': 'Increase quantity',
      's_6c02ab': 'Decrease quantity',
    },
    merchantOnboarding: {
      's_00b623': 'Upload business certificates and company logos. These will be used to dynamically set up your store theme inside the NEXG customer application.',
      's_012a51': 'Please register the legal trading entities. Correct tax identifiers help guarantee smooth fast payouts.',
      's_01edab': 'Search Location Finder',
      's_02aa9a': 'Input branch parameters. You can search using Nominatim autocomplete finder or drop coordinates via the map.',
      's_0bd62e': 'Account Number',
      's_0cb1d6': 'Authorized Officer Signature',
      's_108c09': 'NEXG Riders Fleet',
      's_197803': 'Above 60 minutes',
      's_1c7169': 'Logo preview',
      's_1cf31b': 'Generated via map picker',
      's_20f7df': 'Closing Time *',
      's_21f543': 'Facebook page',
      's_22691e': 'Provide a brief summary of specialties, offerings, or history (max 150 characters)',
      's_26a2ff': 'Based on your category, select common sections to organize your items or add custom ones.',
      's_2eabdb': 'Partnership Agreement Contract',
      's_312631': 'Bank Name',
      's_39e42f': 'Interactive catalog listing on the premium NEXG Client App.',
      's_3e95c1': 'Nominate your payouts destinations. Weekly settlements are transferred directly every Monday morning.',
      's_3fa081': 'You selected',
      's_411097': 'None selected yet. Choose suggestions or add a custom one below.',
      's_4331e0': 'Holiday Closing Time',
      's_4baf91': 'Short Business Description',
      's_4f2047': 'Maintain exact availability schedules, correct pricing, and stock sync lists.',
      's_540d0d': 'Suggested Sections',
      's_550c6f': 'Register primary coordinates. Authorized officers receive system orders, accounts payouts auditing details, and alerts.',
      's_5664e0': 'The Merchant is solely responsible for clearing customs duties, port levies, and ensuring all shipping cargo meets international and local compliance standards.',
      's_59c22e': 'Upload Banner Image',
      's_5fa789': 'You can select multiple specific types if your outlet handles different luxury segments.',
      's_676418': 'Business Paybill No.',
      's_67de19': 'Provide premium white-glove deliveries & concierge orders to luxury customers in Kenya.',
      's_7122f5': 'Business Profile',
      's_71c904': 'NEXG APP LIMITED',
      's_721462': 'Director ID / Passport Scan',
      's_7308b8': 'Review the pre-drafted legal contract. Ensure all merchant parameters, locations, and banking details are correct.',
      's_8242a9': 'Upload business registration scan PDF or image.',
      's_85273b': 'Confirm Coordinates',
      's_869b48': 'NEXG Legal Representative',
      's_87a51d': 'Own Store Riders',
      's_89ac4c': 'Hours Configuration Template',
      's_8c1404': 'Instagram profile',
      's_91091f': 'Type landmark e.g. Yaya Centre, Westlands, Sarit...',
      's_91dd0b': 'TikTok profile',
      's_928d67': 'Coordinates Map Link',
      's_9441e0': 'Branch Manager / Contact Person',
      's_959d0c': 'For NEXG APP LIMITED',
      's_963f97': 'Average Preparation Time',
      's_9d4f8b': 'Type your full legal name',
      's_a03653': 'Expand Your Business with NEXG',
      's_a0b2cf': 'Search categories e.g. Food, Safe, Spa, Flight...',
      's_a133eb': 'Click to add',
      's_a4d472': 'NEXG operates logistics carriage from your store using our background-checked professional couriers.',
      's_a5d0ab': 'Certificate of Registration',
      's_abf9f4': 'Banner preview',
      's_b03404': 'Your premium merchant onboarding is complete. Our partnership audit committee will complete verify checks and activate your store front within 24 hours.',
      's_b32233': 'Website URL',
      's_b62775': 'Upload ID or passport of major primary director.',
      's_b639de': 'Add Section',
      's_b8579d': 'Payment Details',
      's_b9084a': 'Choose Category',
      's_b9f2b1': 'Operating Days',
      's_b9ffbd': 'Merchant Partnership Agreement',
      's_bb20e3': 'For THE MERCHANT',
      's_c05283': 'Choose the category that best aligns with your merchant store operations. Use search or filter down instantly.',
      's_c5955e': 'Opening Time *',
      's_c6846b': 'Signature drawing',
      's_d1bf6b': 'Kenyan Public Holidays Availability',
      's_d1d21f': 'Collection and processing of accounts charges from guests, tourists, and corporate networks.',
      's_d33bf6': 'Merchant Portal',
      's_d7a397': 'Branch Contact Phone',
      's_d890b7': 'Branch Location',
      's_db3b79': 'Account Name',
      's_e0a26d': 'Logistics carriage orchestration based on requested parameters.',
      's_e58331': 'Handwriting Style Preview',
      's_e79369': 'Store Branches & Location Map',
      's_eab077': 'Delivery Carriage Modes',
      's_eab952': 'WhatsApp Dispatch No.',
      's_ebaf4a': 'Paybill Account Name',
      's_ed6a3f': 'Holiday Opening Time',
      's_f1dd4c': 'Buy Goods Till No.',
      's_f7c245': 'Onboard Another Store',
      's_faea7e': 'NEXG App Limited',
    },
    merchantPage: {
      's_c902a1': 'Open Now',
    },
    merchantPreviewSheet: {
      's_0f4c5c': 'This merchant does not declare its own workflow, so the default for its category is shown.',
      's_28da6e': 'See all offerings',
      's_baa550': 'Close preview',
    },
    merchantRoute: {
      's_176135': 'The API may not be running. Start it with',
      's_a1ca54': 'Loading merchant',
      's_e84712': 'Go back',
    },
    merchantView: {
      's_085b31': 'No offerings listed yet',
      's_3fcbae': 'Menu sections',
      's_67300d': 'Clear search',
    },
    metricsDashboard: {
      's_048f2f': 'Status breakdown',
      's_0dd383': 'API version',
      's_1c8836': 'Built at',
      's_235f7b': 'Events accepted',
      's_236a59': 'Bars are per-bucket counts derived from the API\'s cumulative Prometheus buckets.',
      's_266384': '5xx error rate',
      's_406acb': 'Requests / minute',
      's_41e8de': 'Recent traces (/api/traces)',
      's_461aff': 'No spans buffered yet.',
      's_58b6dc': 'In flight',
      's_5dd968': 'Events dropped',
      's_65916f': 'Browser events arrive only from visitors who granted analytics consent.',
      's_74d595': 'No metrics available',
      's_74efa0': 'Metrics API unreachable.',
      's_75e157': 'The dashboard polls',
      's_8474ec': 'No samples yet.',
      's_886fb2': 'Client telemetry',
      's_9d5b00': 'Slowest routes (by p95)',
      's_a41501': 'Runtime, build and data source',
      's_b0ad50': 'No routes recorded yet.',
      's_c347b1': 'Service metrics',
      's_cc1e6a': 'Duration histogram',
      's_cec477': 'Last 60s',
      's_e4076f': 'Collecting samples. The line appears after the second poll.',
      's_ee9d59': 'Database reads',
      's_f8fd6e': 'No responses recorded yet.',
      's_ffb77d': 'Data source',
    },
    nexGCategoryDrilldown: {
      's_03f70c': 'Merchant Providers & Partners',
      's_09efe8': 'Choose a time',
      's_0df6f0': 'Switch Provider',
      's_0ecb20': 'Confirm & Reserve Instant Dispatch',
      's_126f44': 'Preferred Time',
      's_19ad69': 'Scheduled Date',
      's_1b8543': 'Reset All Filters',
      's_1f647f': 'Special Offers',
      's_27c636': 'Complete view',
      's_2994b4': 'Scroll right',
      's_2c9e5a': 'Scroll left',
      's_2f1873': 'All Items',
      's_34318e': 'Rating 4.8+',
      's_492026': 'Add to Order',
      's_4ce3f0': 'Select a Merchant Provider Above',
      's_50238f': 'No upfront charge. Escrow reservation handled by concierge desk.',
      's_543b1b': 'Your reservation for',
      's_5be698': 'Reset Filters',
      's_77bf79': 'Reserve / Book',
      's_7db318': 'Back to Discovery',
      's_8978ea': 'Decision Specifications',
      's_8bf67b': 'Nairobi Luxury District',
      's_9dca31': 'No items found matching your filters.',
      's_ab2d11': 'Under 25 min',
      's_c07c6d': 'Suite Number or Location Notes',
      's_c14e04': 'Browse catalog offerings with real-time pricing and availability',
      's_c25b51': 'Strict Category & Subcategory Catalog',
      's_d394a9': 'Highest Rated',
      's_e16a1d': 'Explore dedicated subcategories with specialized imagery and custom parameters',
      's_eb13c4': 'To view item cards, please click any of the verified merchant providers above. Their full 30-item catalog, specifications, and instant ordering will appear here.',
      's_fae58c': 'Clear Selection',
      's_fcdcf7': 'Fast selections & customer favorites',
    },
    nexGCollectionRail: {
      's_0b3917': 'Curated Collection',
      's_2994b4': 'Scroll right',
      's_2c9e5a': 'Scroll left',
      's_986032': 'Explore All',
    },
    nexGDiscoveryView: {
      's_6d9483': 'Browse verified Nairobi merchants across 20 neighborhoods with Wolt-grade previews',
      's_741311': 'Search food, spa, safaris, champagne, chauffeur...',
      's_76cb8c': 'Previous categories',
      's_844b94': 'Next categories',
      's_8f8796': 'High-priority concierge delivery direct to your suite or villa in under 30 minutes',
      's_a9176a': 'Explore Verticals & Categories',
      's_b0a3fc': 'All Verified Partners & Merchants',
      's_df4cf6': 'Instant Suite Express',
    },
    nexGEntityCard: {
      's_085ed0': 'View catalog & pricing',
    },
    nexGItemSheet: {
      's_0932f6': 'Special App Notes or Dietary Preferences',
      's_22b77f': 'Appointment & Scheduling',
      's_24a16c': 'Session Duration',
      's_3beea0': 'Save to favorites',
      's_65d22e': 'Close sheet',
      's_68f2d8': 'Preferred Date',
      's_693039': 'Time Slot',
      's_a99ee2': 'Number of Guests / Attendees',
      's_c6cf76': 'Added to Experience Order',
      's_d0e359': 'Curated Enhancements & Add-ons',
      's_eeea54': 'NEXG App Guarantee',
    },
    nexGLandingHero: {
      's_0b8149': 'Sign up',
      's_2bd100': 'Enter delivery address, villa or hotel suite...',
      's_381d79': 'Nairobi Villas',
      's_52a6f3': 'For Partners',
      's_71a30d': 'Change Delivery Location',
      's_e17357': 'Active App Fleet in Nairobi',
      's_f7c400': 'Log in',
      's_fa918a': 'Locate my position',
    },
    nexGSearchEngine: {
      's_c5b914': 'No direct matches found',
      's_cd81f4': 'Search Results for',
    },
    offercarousel: {
      's_10bb09': 'Previous Slide',
      's_2aa5dc': 'View Offer',
      's_7141bc': 'Next Slide',
    },
    orderTrackingModal: {
      's_116632': 'Estimated Delivery',
      's_375813': 'Fast forward simulation to next lifecycle stage',
      's_43301e': 'Call Courier',
      's_536456': 'Courier Tip',
      's_61243a': 'Simulated Payment Method',
      's_6e6109': 'Copy delivery security PIN',
      's_74e226': 'Itemized Receipt & PIN',
      's_84e3ee': 'Dismiss / Back to App',
      's_976a74': 'Transaction Reference',
      's_9c12c6': 'Delivery Fee',
      's_9ca905': 'This is an automated simulation of the client ordering lifecycle in NEXG App. No actual payment provider has been billed. Once connected to the live API gateway, genuine payments will be processed via M-Pesa or Stripe.',
      's_9fb5a8': 'Delivery PIN',
      's_a392ce': 'Live Progress Stages',
      's_b868ce': 'Message Courier',
      's_cbac3e': 'App Service',
      's_cd1876': 'Your Location',
      's_d6e963': 'Minimize tracking',
      's_ea2152': 'Live Journey & ETA',
      's_f56564': 'On schedule',
    },
    productcarousel: {
      's_10bb09': 'Previous Slide',
      's_7141bc': 'Next Slide',
    },
    promo: {
      's_38769a': 'For Properties',
      's_4a421c': 'For Merchants',
      's_c63982': 'For Couriers',
      's_d2c984': 'NEXG App App Interface',
    },
    restaurantDetailModal: {
      's_034ad6': 'Recent Google Reviews',
      's_116c19': 'Hospitality & Service',
      's_3beea0': 'Save to favorites',
      's_4f2130': 'Google Restaurant Reviews',
      's_52aed7': 'Food Quality',
      's_56ba29': 'No dishes match your search criteria.',
      's_649ff9': 'Add to order',
      's_652bc8': 'Posted on Google',
      's_79db72': 'View & Write Reviews',
      's_79fe15': 'View Google Reviews',
      's_9c203d': 'Artisanal Menu',
      's_9f068b': 'Verified Place',
      's_a023e6': 'Chef Pick',
      's_b05630': 'Synced Live',
      's_b38795': 'Search dishes...',
      's_c152be': 'No Google reviews loaded for this venue.',
      's_e1c6bf': 'Atmosphere & Transport',
      's_f4657b': 'Google Maps Rating',
    },
    restaurants: {
      's_0721cf': 'Your reservation at',
      's_072c89': 'Reserve Table',
      's_0c8f01': 'Table Reservation',
      's_25b120': 'Selected Reservation',
      's_2c3b25': 'Confirm Table',
      's_34df71': 'Search dining partners, sushi, dry-aged steaks, pasta...',
      's_4f9fa0': 'Google Maps Location',
      's_5be698': 'Reset Filters',
      's_5f716b': 'Try adjusting your search keywords or resetting cuisine filters.',
      's_6b2c05': 'Fine Dining Partners',
      's_7288fd': 'Fine Dining Partners & Master Chefs',
      's_868fb0': 'Click any dish to configure ingredients, accompaniments, or place a simulated order',
      's_99256e': 'Curated Culinary Directory',
      's_9da221': 'Featured Partner',
      's_a1e9f9': 'Explore Home',
      's_ae0cb2': 'Signature Dishes & Menu Offerings',
      's_bf0c7d': 'Back to all Dining Partners & Merchants',
      's_cfdf8b': 'Search menu dishes...',
      's_d97dd5': 'View Google Reviews & Diner Insights',
      's_dde236': 'Customize & Order',
      's_e25e77': 'Select a merchant to explore their Michelin-grade menu, signature dishes, verified Google diner reviews, and table reservations.',
      's_eac205': 'No dining partners match your filters',
    },
    routeFallback: {
      's_1c5772': "正在加载页面",
    },
    scrollToTop: {
      's_f07710': "回到页面顶部",
    },
    spaBookingModal: {
      's_039d05': 'Experience Setting',
      's_09121f': 'Appointment Slot',
      's_15ddf4': 'District Wellness Experience',
      's_17548b': 'Slot Scheduled',
      's_2fd731': 'Signature Aromatherapy Oil',
      's_301d19': 'Live Dispatch Progress',
      's_4548b7': 'Our certified therapist will arrive 10 minutes prior with sanitized organic towels, ultrasonic mist diffuser, and a heated memory-foam bed.',
      's_485336': 'Villa / Suite Number',
      's_4b8ec9': 'Private In-Villa Sanctuary',
      's_5621b9': 'Focus Areas & Medical Notes',
      's_712231': 'Contact Spa Concierge',
      's_7d1e9d': 'Private oceanfront cabana with thermal plunge pool & tranquil zen garden access.',
      's_8cff8d': 'Total Experience Fee',
      's_9092d9': 'Add to Calendar',
      's_9505aa': 'Total Concierge Charge',
      's_950d86': 'Massage Pressure Preference',
      's_9a36a0': 'Confirm Spa Booking',
      's_9e603c': 'Therapist dispatches directly to your villa with heated table, organic linens & aromatherapy.',
      's_a027ba': 'Select Ritual Duration',
      's_b3a5a1': 'Concierge In-Villa Service Protocol',
      's_be9475': 'Therapist Preference',
      's_c0a672': 'Appointment Confirmed',
      's_c8c5fe': 'Primary Guest Name',
      's_f00e02': 'Assigned Master Therapist',
      's_f79d9c': 'Resort Spa Pavilion',
    },
    spaWellness: {
      's_120405': 'Select Ritual',
      's_3669be': 'Book Calendar',
      's_5276ac': 'Your appointment at',
      's_5dfb4e': 'Spa & Wellness Sanctuaries',
      's_659a92': 'Search spa sanctuaries, Balinese, deep tissue, sauna...',
      's_689bea': 'Back to all Sanctuary Partners',
      's_69d23c': 'District Holistic Wellness & Spa',
      's_9aabe9': 'Book Session',
      's_a1e9f9': 'Explore Home',
      's_c1c2fb': 'Sanctuary Spas & In-Villa Wellness',
      's_d02cb4': 'Search rituals & massages...',
      's_eb9e1e': 'Confirm Booking',
      's_f212ea': 'Spa Sanctuary Reservation',
      's_f2937f': 'Select duration, botanical essential oils, and schedule an immediate in-villa or pavilion appointment',
      's_fda6e0': 'Select a wellness sanctuary to browse certified therapists, in-villa Balinese massages, Ayurvedic Shirodhara, and hydrothermal rituals.',
      's_fe0476': 'Sanctuary Treatments & In-Villa Rituals',
    },
    stats: {
      's_034abd': 'From hotels to homes, we make everyday exceptional.',
      's_826dd3': 'Hotel Partners',
      's_bd3fa2': 'Our Partners',
      's_dc04b9': 'Dar es Salaam',
      's_e819e6': 'Concierge Support',
      's_f2a377': 'Trusted by guests',
    },
    transportBookingModal: {
      's_1505c5': 'Live Dispatch Status',
      's_160ad9': 'Chauffeur Confirmed',
      's_251e18': 'Dedicated Chauffeur Hours',
      's_314bee': 'Total Concierge Fee',
      's_358b66': 'Pickup Time',
      's_36a60c': 'Done & Return to App',
      's_39b21c': 'Call Chauffeur',
      's_457b66': 'Total Rate',
      's_6f672b': 'Assigned Chauffeur',
      's_77ae94': 'Scheduled Departure',
      's_7a4175': 'Schedule Date',
      's_8941e9': 'Service Type',
      's_8dea76': 'Pickup Location',
      's_99d1c7': 'Confirm VIP Chauffeur',
      's_9ca1bd': 'Day After',
      's_a1cbc4': 'VIP Meet & Greet + Airport Flight Sync',
      's_b68827': 'Villa / Suite Room',
      's_be057d': 'Guest Name',
      's_cd11b4': 'Complimentary On-Board Amenities',
      's_d0cd2d': 'Flight Number / Departure Code',
      's_efb6c4': 'Continue to Amenities',
      's_f2f922': 'VIP Concierge Mobility',
    },
    transportPage: {
      's_1836d5': 'Choose a luxury mobility merchant to view available Maybach S680s, Rolls-Royce Ghost motorcars, Cadillac Escalade ESVs, or twin-engine helicopter transfers.',
      's_1afb28': 'Back to all Mobility Partners',
      's_2ea911': 'Chauffeur Reservation',
      's_3390d4': 'Reserve Chauffeur',
      's_3727e7': 'Book Transfer',
      's_52b224': 'VIP Chauffeur & Mobility Providers',
      's_543b1b': 'Your reservation for',
      's_784e6e': 'Search mobility providers, Maybach, Rolls-Royce, helicopter...',
      's_875bd6': 'Executive Chauffeurs & Private Aviation',
      's_898adc': 'VIP White-Glove Mobility',
      's_93f4b8': 'Pickup Date & Time',
      's_a1e9f9': 'Explore Home',
      's_eac49e': 'Book Vehicle',
      's_eb9e1e': 'Confirm Booking',
    },
    unifiedItemModal: {
      's_0125ec': 'View All Reviews',
      's_1cc3d0': 'Aromatherapy Essential Oil',
      's_3c0047': 'Dedicated Appointment Calendar',
      's_4c13f0': 'App Notes & Villa Details',
      's_5d14d6': 'E.g. Villa Suite 402, gate access code, dietary allergies, or arrival notes...',
      's_94c578': 'Confirm Calendar Reservation',
      's_a027ba': 'Select Ritual Duration',
      's_bf3b18': 'Add to App Cart',
      's_ee3e2e': 'About this offering',
      's_ee749a': 'Total Estimate',
    },
  },

  /*
    SHARED FORM VOCABULARY.

    These are the strings that appear on more than one form — an email label on four onboarding
    flows, "Save draft" on three. Extracting them means a later component references a key that
    already exists rather than adding a fifty-first way to say "Full name".

    Scoped deliberately: it holds what is genuinely common and nothing else. Form-specific copy
    ("Driver's License Expiry Date", "E.g. KMCA 123A") stays with its own screen, because
    collecting one-off strings into a shared block is how a shared block becomes unmaintainable.

    Placeholders use {braces} where a value is substituted. See forms.stepOf.
  */
  forms: {
    actionSave: '保存',
    actionSaveDraft: '保存草稿',
    actionContinue: '继续',
    actionBack: '返回',
    actionNext: '下一步',
    actionCancel: '取消',
    actionConfirm: '确认',
    actionSubmit: '提交',
    actionReview: '检查',
    actionEdit: '编辑',
    actionRemove: '移除',
    actionUpload: '上传',
    actionTryAgain: '重试',
    fullName: '姓名',
    emailAddress: '电子邮箱',
    phoneNumber: '电话号码',
    whatsappNumber: 'WhatsApp 号码',
    nationalId: '身份证号码',
    dateOfBirth: '出生日期',
    county: '县 / 地区',
    addressStreet: '地址 / 街道',
    areaNeighbourhood: '区域 / 街区',
    preferredContact: '首选联系方式',
    documentType: '文件类型',
    documentUpload: '上传文件',
    documentExpiry: '到期日期',
    businessRegistration: '营业执照',
    taxPin: '税号',
    certificateOfIncorporation: '公司注册证书',
    bankName: '银行名称',
    accountName: '账户名称',
    accountNumber: '账号',
    branchName: '分行',
    mobileMoneyNumber: '移动支付号码',
    paymentMethod: '付款方式',
    chooseDate: '选择日期',
    chooseOption: '选择一个选项',
    selectYourRole: '选择您的角色',
    yes: '是',
    no: '否',
    optional: '可选',
    required: '必填',
    thisFieldRequired: '此字段为必填项',
    enterValidEmail: '请输入有效的电子邮箱',
    enterValidPhone: '请输入有效的电话号码',
    selectOneOption: '请选择一个选项',
    uploadRequired: '请上传所需文件',
    stepOf: '第 {current} 步，共 {total} 步',
    unsavedChanges: '您有未保存的更改',
    placeholderFullName: '您的姓名',
    placeholderEmail: 'you@example.com',
    placeholderPhoneKe: '+254 7XX XXX XXX',
    placeholderExample: '例如：{value}',
  },
    nav: {
      home: '首页',
      explore: '探索探索',
      restaurants: '米其林美馔',
      spa: '水疗与养生',
      spaDistrict: '尊享专区',
      transport: '贵宾专车',
      groceries: '名庄珍酿',
      experiences: '定制体验',
      partners: '合作伙伴',
      forProperties: '酒店与物业合作',
      forCouriers: '加入骑士车队',
      forMerchants: '商家入驻合作',
      partnerOnboarding: '合作申请入驻',
      applyFleet: '申请加入车队',
      listBusiness: '商家入驻申请',
      track: '实时追踪',
      viewCart: '礼宾账单',
      appearanceMode: '外观显示模式',
      lightMode: '日间明朗模式',
      darkMode: '夜间静谧模式',
      selectLanguage: '切换系统语言',
      menu: '主菜单',
      close: '关闭',
    },
    hero: {
      badge: '顶级奢华酒店管家礼宾系统',
      titleLine1: '您所需的一切尊享体验，',
      titleLine2: '皆在当下触手可得。',
      subtitle: '随时订购顶级名厨珍馐、预约别墅水疗理疗、召唤迈巴赫专车接送，享受白手套尊崇配送直达您的私享套房与泳池露台。',
      searchPlaceholder: '搜索餐厅、水疗、专车',
      searchBtn: '搜索服务',
      popular: '热门推荐：',
      sugMichelin: '米其林美馔',
      sugMassage: '巴厘岛精油水疗',
      sugMaybach: '迈巴赫礼宾车队',
      sugCaviar: '名庄鱼子酱酒窖',
      sugYacht: '私人游艇出海',
      btnFineDining: '米其林餐厅',
      btnSpa: '水疗与养生',
      btnMobility: '贵宾出行',
      ambienceDaylight: '日光朗照模式',
      ambienceTwilight: '暮色流光模式',
    },
    categories: {
      heading: '私享礼宾服务分类',
      subtitle: '点击以下专属分类，浏览直达别墅的顶级美馔、理疗SPA、豪华车队与尊崇礼遇。',
      groceriesTitle: '名酿与食品',
      groceriesDesc: '名庄佳酿、顶级鱼子酱与新鲜食材',
      transportTitle: '贵宾出行',
      transportDesc: '机场迈巴赫、劳斯莱斯与直升机包机',
      spaTitle: '水疗与养生',
      spaDesc: '套房巴厘岛按摩、面部护理与水疗',
      restaurantsTitle: '美馔佳肴',
      restaurantsDesc: '米其林星级客房送餐与私厨定制',
      experiencesTitle: '专属体验',
      experiencesDesc: '私人游艇巡航、直升机观光与马术',
      essentialsTitle: '奢享备品',
      essentialsDesc: '个人护理、高端补水与舒缓必备品',
      viewAll: '浏览全部礼宾类别',
    },
    howItWorks: {
      badge: 'NEXG 本地服务市场',
      heading: 'NEXG 汇集内罗毕的各类服务',
      subtitle: '三步探索服务、找到所需内容，然后下单、预约或提交需求。',
      step1Title: '扫码即刻开启',
      step1Desc: '扫描房间专属二维码或在任何设备浏览器中一键打开，无需下载安装任何 App。',
      step2Title: '探索 21 个服务类别',
      step2Desc: '在一个市场中探索餐厅、杂货、药房、健康服务、出行、本地体验等多种服务。',
      step3Title: '下单、预约或提交需求',
      step3Desc: '根据服务选择操作：下单、预约时段、提交服务需求或询价。',
    },
    promo: {
      badge: '尊贵宾客专属礼遇',
      heading: '首单尊享免礼宾配送附加费',
      desc: '在所有米其林餐厅与名庄珍酿订单中，凭房号授权即可享受免收外送服务费特权。',
      cta: '立即探索顶级美馔',
      code: '尊享礼券码：VILLA2026',
      appHeading1: '随身携带 NEXG',
      appHeading2: '无处不在',
      appSubtitle: '为住客、居民与环球旅行者打造的一站式尊享 App。',
      downloadOn: '前往下载',
      appStore: 'App Store',
      getItOn: '立即获取',
      googlePlay: 'Google Play',
      merchantsTitle: '针对商家伙伴',
      merchantsDesc: '携手 NEXG 拓展您的尊贵业务。',
      merchantsCta: '与我们合作',
      couriersTitle: '针对专职骑手',
      couriersDesc: '传递卓越。加入我们的精英车队。',
      couriersCta: '立即申请',
      propertiesTitle: '针对酒店物业',
      propertiesDesc: '全面升级您的宾客度假体验。',
      propertiesCta: '入驻合作',
    },
    features: {
      badge: '卓越与信任',
      heading: '奢华酒店服务最高标准',
      subtitle: '为何全球顶奢度假村、私人豪宅与高端旅客始终信赖 NEXG。',
      feat1Title: '24/7 全天候多语种礼宾',
      feat1Desc: '专属客服即时响应私人忌口偏好、预约包场与精准定时配送。',
      feat2Title: '米其林名厨与顶级伙伴',
      feat2Desc: '直连当地地标餐厅、认证侍酒大师与高级认证芳疗师团队。',
      feat3Title: '绝对私密与安全保障',
      feat3Desc: '加密房账签单系统、无接触安全配送协议与严格的宾客隐私保密。',
      feat4Title: '恒温专用车队与极速送达',
      feat4Desc: '专业冷热温控箱与豪华商务座驾，确保每道珍馐与香槟处于最佳品鉴温度。',
      f1Title: '安全支付',
      f1Desc: '安全且全程加密',
      f2Title: '实时物流追踪',
      f2Desc: '随时掌握订单位置',
      f3Title: '多元支付方式',
      f3Desc: '支持信用卡、M-Pesa等',
      f4Title: '私密尊享送达',
      f4Desc: '绝对保障个人隐私',
    },
    restaurants: {
      title: '米其林星级美馔与客房送餐',
      subtitle: '顶级厨艺大师名菜直接热腾腾送达您的餐桌，尽享私密饕餮盛宴。',
      searchPlaceholder: '搜索餐厅、顶级寿司、和牛、黑松露意面...',
      filterAll: '全部风味',
      filterJapanese: '日料 / 厨师发办',
      filterItalian: '意式风味 / 手工意面',
      filterFrench: '法式高级料理',
      filterMediterranean: '地中海风味',
      filterSteakhouse: '顶级牛排馆与炭烤',
      filterDesserts: '名厨手工甜品',
      viewMenu: '查看完整菜单',
      minOrder: '起送金额',
      deliveryTime: '预计送达时间',
      featuredDish: '主厨招牌推荐',
      addToBag: '加入礼宾账单',
      closed: '准备中',
      openNow: '正在接单',
    },
    spa: {
      title: '私享水疗与养生护理',
      subtitle: '将您的私享别墅打造成专属疗愈绿洲，由资深理疗大师提供顶级水疗护理。',
      bookTreatment: '预约护理',
      duration: '理疗时长',
      inVilla: '别墅 / 套房内',
      sanctuary: '水疗专属亭',
      therapistGender: '理疗师偏好',
      anyTherapist: '不限偏好',
      femaleTherapist: '女性理疗师',
      maleTherapist: '男性理疗师',
      reserveNow: '立即确认预约',
    },
    transport: {
      title: '贵宾专车与行政司机接送',
      subtitle: '随叫随到的迈巴赫轿车、路虎揽胜行政 SUV 与私人直升机接驳服务。',
      chauffeurIncluded: '包含专职白手套司机',
      perHour: '/ 小时',
      airportTransfer: '机场 VIP 极速接送',
      bookChauffeur: '预订专车',
      capacity: '乘坐人数',
      luggage: '行李容量',
      instantDispatch: '优先即时派车',
    },
    groceries: {
      title: '名庄酒窖与私享食库',
      subtitle: '特级园香槟、俄罗斯顶级白鲟鱼子酱、黑松露熟食与当日有机新鲜早餐备品。',
      cellar: '特级园名庄酒窖',
      pantry: '高端美食专柜',
      caviar: '顶级鱼子酱与珍馐',
      bakery: '清晨现烤欧包点心',
      addToCart: '加入采购单',
      inStock: '现货即时配送',
    },
    experiences: {
      title: '量身定制的尊崇体验',
      subtitle: '难忘的私人豪华游艇出海、直升机高空俯瞰、沙漠星空露营与私人马术课程。',
      bookExperience: '咨询并预约',
      groupSize: '最大接待人数',
      duration: '体验总时长',
      vipHostIncluded: '配备专属礼宾向导',
    },
    cart: {
      title: '您的礼宾账单',
      emptyTitle: '您的礼宾袋为空',
      emptyDesc: '挑选米其林美食、预约水疗理疗、品鉴佳酿或呼叫专车以开始您的订单。',
      exploreBtn: '浏览餐饮与服务',
      subtotal: '商品小计',
      deliveryFee: '白手套专享配送费',
      conciergeService: '礼宾服务费 (5%)',
      total: '应付总额',
      checkoutBtn: '前往房账授权支付',
      villaPlaceholder: '别墅 / 总统套房房号',
      specialNotes: '主厨特殊制作要求或指定送达时间...',
      orderPlaced: '订单已成功下单！',
      items: '件商品',
      clearCart: '清空账单',
    },
    tracking: {
      title: '实时礼宾物流追踪',
      orderNumber: '订单编号',
      estimatedArrival: '预计送达时间',
      mins: '分钟',
      statusConfirmed: '礼宾部已确认订单',
      statusPreparing: '主厨 / 商家精心备货中',
      statusInTransit: '专职骑士正在送往您的套房',
      statusDelivered: '已送达别墅门口',
      courierAssigned: '负责配送礼宾员',
      contactConcierge: '致电礼宾服务台',
      close: '收起追踪器',
    },
    footer: {
      brandDesc: '全球领先的五星级酒店奢华礼宾平台。将顶级度假村、私享别墅与高净值旅客同当地顶尖名厨、健康养生大师和尊贵出行专车无缝连接。',
      exploreTitle: '礼宾服务导航',
      partnersTitle: '企业与合作伙伴',
      legalTitle: '信托与合规保障',
      privacy: '隐私权政策',
      terms: '服务条款',
      cookies: 'Cookie 偏好设置',
      rightsReserved: '版权所有。NEXG App International 保留一切权利。',
      language: '语言 / 地区',
      craftedWith: '专为五星级奢华酒店服务定制',
      aboutText: '极简奢华款待。在肯尼亚打造独具品味的私享配送与专属礼宾体验。',
      verticals: '礼宾品类',
      fineDining: '米其林美馔',
      spaWellness: '水疗与养生',
      vipMobility: '贵宾出行',
      gourmetCellar: '名庄酒窖',
      experiences: '定制体验',
      partners: '合作伙伴',
      forMerchants: '商家合作',
      forCouriers: '骑手招募',
      forProperties: '酒店物业',
      legalSupport: '法律与支持',
      conciergeDesk: '礼宾服务台',
      termsOfService: '服务条款',
      privacyPolicy: '隐私政策',
      safetyStandards: '安全标准',
      connect: '联系与互动',
      rights: '© 2026 NEXG App. 版权所有。',
      simulatedNotice: '模拟支付网关演示（等待接入实时网关）',
    },
    partnerHeaders: {
      ecosystem: '生态系统',
      qrTech: '二维码技术',
      revShareCalc: '分润计算器',
      integrations: '系统对接',
      benefits: '合作优势',
      logistics: '物流支持',
      howItWorks: '运作流程',
      categories: '入驻品类',
      earningsCalc: '收入测算',
      fleetPerks: '车队福利',
      standards: '服务标准',
      faq: '常见疑问',
    },
    partnersPortal: {
      merchantTitle: '商家入驻伙伴',
      merchantSubtitle: '将您的名厨料理与奢华备品拓展至五星级度假村别墅与总统套房。',
      courierTitle: '精英骑士车队',
      courierSubtitle: '配送奢华礼宾订单，享受丰厚基础单价与专属小费收益。',
      propertiesTitle: '酒店与物业合作',
      propertiesSubtitle: '零资本投入的客房私享礼宾服务系统与全自动收益分成。',
      backHome: '返回宾客礼宾中心',
      listBusiness: '商家入驻申请',
      applyFleet: '申请加入车队',
      partnerNexg: '与 NEXG 携手合作',
      onboardingActive: '进行中',
      onboardingStatus: '入驻申请状态',
      stepText: '步骤',
      ofText: '共',
      nextStep: '下一步',
      prevStep: '上一步',
      submitApplication: '提交申请',
      agreementTitle: '合作协议条款',
      agreementDesc: '请仔细阅读以下合作协议条款并在底部完成数字签署。',
      successTitle: '入驻申请已成功提交！',
      successDesc: '我们的礼宾审核委员会将在24小时内审核您的材料并与您取得联系。',
      returnHome: '返回门户首页',
      downloadSummary: '下载申请摘要 PDF',
      riderPortal: '骑手合作门户',
      eastAfricaSecure: '东非专区 • 安全入驻',
      backToSite: '返回主页',
      activeStatus: '进行中',
    },
  },
  sw: {
  ui: {
    bookingCalendar: {
      's_07499a': 'Party / Guests',
      's_10422c': 'Local Villa Time',
      's_183a37': 'Sync Calendar',
      's_534c34': 'Next Month',
      's_71b856': 'Previous Month',
      's_79caea': 'Available Time Slots',
      's_8efff8': 'In 2 Days',
      's_aeb91b': 'Dedicated Reservation Calendar',
      's_e5366b': 'Selected Schedule',
      's_fdc2b8': 'Next Week',
    },
    cartDrawer: {
      's_11a9f0': 'Explore Menus',
      's_1fc724': 'Promo code (try NEXG20)',
      's_2303a3': 'Your cart is empty',
      's_237e47': 'Clear entire cart',
      's_2c7952': 'Simulated checkout & instant confirmation',
      's_42cb61': 'Close cart',
      's_44951e': 'Courier tip',
      's_643b96': 'Your Order Cart',
      's_733b61': 'Delivery fee',
      's_76ecba': 'Remove item',
      's_ab8546': 'Explore our curated restaurants and add artisanal dishes or concierge dining to get started.',
      's_c7085d': 'Courier Concierge Tip',
      's_d2467b': 'Your order',
      's_d2f4d4': 'Proceed to Checkout',
      's_d6ea26': 'Concierge service fee',
    },
    categories: {
      's_1a9863': 'Browse Partners',
    },
    categoryExplorerModal: {
      's_233e38': 'Click any category or subcategory to instantly browse partners',
      's_7c267a': 'View listings',
      's_7fd08b': 'Reset Catalog Filters',
      's_940323': 'Close categories',
      's_af1c10': 'Verified Merchant Partners',
      's_c7fa37': 'Try searching for another keyword or clear the search query.',
      's_c9f43c': 'Search across all 21 categories & 134 subcategories (e.g. Fine Dining, Vapes, Chauffeur, Safari)...',
      's_e37ac9': 'No matching verticals found',
      's_f4cf7c': 'Merchant Categories & Subcategories',
    },
    categoryPage: {
      's_004d7e': 'Top Rated',
      's_062888': 'Free Delivery',
      's_2cef94': 'Reset all filters',
      's_41eb8f': 'Fastest Delivery',
      's_c4baea': 'Price Level',
      's_fce284': 'No merchants found matching your filters.',
    },
    checkoutSimulatedModal: {
      's_119c2f': 'This payment is',
      's_19e2a2': 'Finalize & Place Order',
      's_3a7a99': 'Apple Pay',
      's_55e54d': 'App Delivery Instructions',
      's_635949': 'Choose Simulated Payment Method',
      's_63da07': 'Simulate Payment & Place Order',
      's_6aa79c': 'Selected Items',
      's_7db213': 'Hotel / Villa / Street Address',
      's_846466': 'Close checkout',
      's_882f46': 'Simulates instant STK push prompt directly on mobile handset.',
      's_9ad55a': 'Total Demo Amount',
      's_ac51d0': 'Cardholder Name',
      's_b79126': 'No real funds or accounts will be debited.',
      's_bac774': 'Simulated Demo Checkout',
      's_bb36a9': 'DEMO ROUTER',
      's_cecb67': 'Preloaded Demo Card',
      's_dd0a60': 'Router Demo Validated',
      's_e5297b': 'Delivery Address & Location',
      's_e569ab': 'Processing Demo Payment...',
      's_ea3289': 'Room Folio / Cash',
      's_ea4478': 'Simulates one-touch FaceID / TouchID authorization.',
      's_eb034a': 'Billed directly to your hotel master room folio upon delivery.',
      's_ee343f': 'Sandbox Router Active',
      's_fee23b': 'Merchant Partner',
    },
    consentBanner: {
      's_35c291': "Kataa zote",
      's_66cd82': 'ملفات تعريف الارتباط الضرورية للغاية تحافظ على عمل الموقع. تبقى ملفات التحليلات والتسويق معطلة حتى تقوم بتشغيلها، ويمكنك تغيير ذلك في أي وقت.',
      's_788df5': "Chaguo zako za vidakuzi",
      's_821d1f': "Kubali zote",
      's_956fa7': "Hifadhi chaguo",
      's_9e0cba': "Mipangilio ya vidakuzi",
      's_da6a92': "Vidakuzi muhimu huwashwa kila wakati. Vidakuzi vingine vyote ni hiari.",
      's_e7d306': "Mapendeleo ya vidakuzi",
      's_f477c8': "Huwashwa kila wakati. Hakiwezi kuzimwa kwa sababu tovuti haiwezi kufanya kazi bila hicho.",
    },
    courierOnboarding: {
      's_037e0b': 'Our compliance officers verify your submitted National ID, license, PIN, and fleet logbooks directly against NTSA registers.',
      's_03c52e': 'Guaranteed Base Salary',
      's_06c8b6': 'Verify your registered logistics enterprise. Only PDF files and scanned images up to 5MB size are accepted.',
      's_0b39f6': 'Fleet Partner',
      's_0bd62e': 'Account Number',
      's_0cb44f': 'Executive Sedan / Van',
      's_0d36d5': 'Active public third-party or comprehensive fleet cover policy certificate.',
      's_0d98d0': 'E.g. Swift Deliveries',
      's_0e3256': 'Submit official identification and transit licensing details.',
      's_0f32ec': 'Rider Record Card',
      's_1081b3': 'Full Name, Phone, ID Number, License Number, Vehicle Type, Plate Number',
      's_10f420': 'Shift & Operating Zones',
      's_14bf35': 'Ride custom NEXG-branded premium logistics vehicles, operate consistent shifts, and enjoy a stable guaranteed base salary.',
      's_156177': 'Certificate of Incorporation',
      's_17b238': 'Accepted For Fleet Provider',
      's_1805c7': 'This agreement begins immediately on approval and is valid for a period of 12 months. Either party may terminate with 7 days\' written notice, or NEXG may block platform access instantly in cases of safety breach, driving license revocation, or fraudulent behavior.',
      's_197646': 'Full Legal Name',
      's_204be3': 'E.g. operations@swiftlogistics.co.ke',
      's_2358e6': 'Independent Rider',
      's_24813d': 'E.g. Kileleshwa, Block D',
      's_26712f': 'Authorized Primary Contact Person',
      's_27538f': 'Outline your company’s transit capacities and target operating logistics zones.',
      's_27980f': 'WhatsApp Mobile Number',
      's_27c646': 'Company Office Headquarters',
      's_2952ca': 'Type Signature',
      's_2b31a3': 'E.g. A001234567Z',
      's_2cb0d8': 'Accepted & Agreed by Rider',
      's_2d6ca0': 'Vehicle Type',
      's_2dc8f1': 'E.g. Corner House, 4th Floor, Kimathi St.',
      's_2ed783': 'Return to Elite Fleet page',
      's_30b928': 'Company KRA PIN Certificate',
      's_310c80': 'Back to Couriers',
      's_312631': 'Bank Name',
      's_3174a5': 'Contact Email Address',
      's_31843b': 'Clear canvas',
      's_338cf2': 'Services & Settlement Payout',
      's_340115': 'Clear scanned copy of front and back face of your card.',
      's_34e784': 'E.g. Swift Express Logistics Ltd',
      's_34f9ae': 'Certificate of Incorporation / Reg No.',
      's_377b90': 'Authorized Dispatch Committee',
      's_37dfba': 'NTSA Driver\'s License Number',
      's_3873df': 'E.g. DL-XXXXXX',
      's_3af714': 'No active couriers added yet',
      's_3ba957': 'E.g. Nairobi',
      's_3bfd88': 'KRA PIN Number',
      's_3c3541': 'Consolidated Business payout',
      's_3c774b': 'Carry VIP guests to properties',
      's_3cc4fd': 'NEXG Provides Vehicle',
      's_3ce5aa': 'Emergency Contact Person',
      's_41d914': 'Choose the expiry date',
      's_41fe24': 'Draw digital signature with finger or pointer',
      's_430404': 'Remove Card',
      's_44fe57': 'Emergency Mobile Phone',
      's_464dfd': 'We declare absolute compliance with Kenyan corporate regulations, active tax filings, and legal road safety acts.',
      's_4979be': 'We certify that all couriers listed in our squad profiles hold valid, unexpired NTSA driving licenses and clean background clearance certifications.',
      's_4c7486': 'Corporate Job Title',
      's_4c987a': 'Authorized Officer Full Name',
      's_4d1c2f': 'Structured Shift schedules',
      's_4ff862': 'E.g. 4',
      's_50d865': 'Upload crisp clear photo snapshots or PDF files under 5MB size limit.',
      's_5104d5': 'Preferred Operating Area Zone',
      's_51dacf': 'WhatsApp Number',
      's_53d718': 'The Fleet Provider represents and warrants that all couriers and motorbikes comply with roadworthy rules, hold comprehensive insurance certifications, and observe Kenya\'s Data Protection Act 2019 standards.',
      's_55537f': 'Vehicle Registration details',
      's_574f02': 'Next Step',
      's_587649': 'Official KRA Pin certification document page from iTax portal.',
      's_5920ae': 'You are applying for a scheduled, salaried position. NEXG provides custom branded bikes, gear, and fuel budgets. Below, you will also designate your operational preferences.',
      's_5a833b': 'Residential Address',
      's_5b5250': 'Fleet Partner Business Profile',
      's_5cfa43': 'NTSA Driving License',
      's_5f5518': 'Drive your own motorcycle or scooter, set your flexible calendar hours, and take commissions per successfully completed errand.',
      's_63a113': 'Total Registered Vehicles',
      's_64346b': 'Full Name',
      's_6790f2': 'Corporate Bank Name',
      's_692fe8': 'E.g. P051234567Z',
      's_6b3d6a': 'Deliver premium retail items',
      's_6f9c91': 'E.g. +254 711...',
      's_70abeb': 'Bank Settlement Transfer',
      's_714406': 'Configure your legal registered business details for logistics partnerships.',
      's_717eb1': 'Company Account Title',
      's_71c904': 'NEXG APP LIMITED',
      's_71ebbb': 'E.g. Red Honda CB125F (Year 2023)',
      's_71f6e3': 'Register Active Couriers Squad',
      's_72a587': 'Board Operations Committee',
      's_74955f': 'E.g. Westlands',
      's_76af1d': 'E.g. 15',
      's_77522e': 'NEXT STEPS IN OUR VERIFICATION TIMELINE',
      's_79865b': 'Preferred Working Shift',
      's_7cf2e1': 'Alternative Contact Phone',
      's_7d5f6e': 'Unlock premier delivery earnings, tailored branding, and unmatched support in Kenya’s luxury hospitality ecosystem.',
      's_7d8667': 'Plate Number',
      's_81db77': 'Years in Logistics Sector',
      's_827c49': 'Account Holder Legal Name',
      's_828ade': 'Vip App',
      's_831dc7': 'KRA PIN Confirmation Certificate',
      's_86d4ca': 'For NEXG App',
      's_8bb6da': 'E.g. 12345678',
      's_8d5d4c': 'Company Business Verification Documents',
      's_8e203d': 'Handle high-end guest requests',
      's_8f912f': 'E.g. CPR/2018/12345',
      's_903d8d': 'Execute Partnership Agreement Contract',
      's_913798': 'Click Add Rider Card above or upload your riders spreadsheet via CSV bulk import.',
      's_93457d': 'Fleet Operational Scale & Coverage',
      's_93e220': 'Corporate Fleet Partner logistics Framework',
      's_9691d0': 'ONBOARDING PROFILE SUMMARY',
      's_984805': 'Operating Counties & Estates Coverage',
      's_99dc14': 'Pending Compliance Review',
      's_9d159c': 'Direct Mobile Number',
      's_a0094a': 'Payout Method',
      's_a1524d': 'E.g. 12001234567',
      's_a1c4fe': 'E.g. +254 700 111 222',
      's_a221a1': 'Upon document clearance, you\'ll receive a WhatsApp invitation to join our premium standard customer service and hospitality training.',
      's_a40d60': 'Premium Commission Payout',
      's_a620a5': 'Official business registration certificate page issued by the Registrar of Companies.',
      's_a7c94e': 'NEXG agrees to compile and settle client order payments to the Fleet Provider’s registered bank account weekly on Mondays, less a platform operations commission fee of',
      's_a85feb': 'Your premium motorbike is provided by NEXG. You do not need to register a personal motorbike logbook or license plate here.',
      's_a8caa4': 'Add individual active riders to your partnership ledger.',
      's_aafa84': 'Active Vehicle types represented in Fleet',
      's_ac26fd': 'Submit Portfolio Agreement',
      's_ad7df6': 'Motorcycle / Scooter',
      's_aed4fc': 'Join the Elite NEXG Rider Fleet',
      's_aef6a9': 'National ID / Passport Number',
      's_af7bb7': 'Signatory Director\'s National ID',
      's_af8a4e': 'The Fleet Provider certifies that they actively manage and pay a squad of',
      's_b026ba': 'City HQ Location',
      's_b09e88': 'Draw Signature',
      's_b21f30': 'ID Number',
      's_b2e0a8': 'Driver\'s License Expiry Date *',
      's_b5015c': 'List all cities and estates where your fleet currently has active coverage. E.g. Nairobi CBD, Westlands, Kilimani, Mombasa, Diani, etc.',
      's_b5c479': 'NEXG Dedicated Rider',
      's_b724e7': 'Print Agreement Document',
      's_b984fa': 'Import CSV Spreadsheet',
      's_b9d00c': 'This contract is binding for a term of 12 months. Either partner may exit the frame by providing 14 days\' written notice to the other party.',
      's_bc5303': 'Add Rider Card',
      's_bf24cb': 'Name exactly as printed on legal ID card',
      's_c1ecb3': 'Package Delivery',
      's_c33c9b': 'DL Number',
      's_c59900': 'E.g. KMCA 123A',
      's_c7a051': 'We declare that our organization maintains comprehensive third-party logistics insurance and active public liability coverage across all active fleet operators.',
      's_c85d99': 'Proof of ownership and active public transit insurance coverage.',
      's_c8708a': 'Company Legal Name',
      's_c8bc71': 'Corporate Bank Settlement Account',
      's_c8ed49': 'Identification & Vehicle Setup',
      's_ca5690': 'Download Standard CSV Template',
      's_cabacd': 'NEXG Operations Admin',
      's_cdec1f': 'Both sides of your active, unexpired logistics driver license.',
      's_d101b7': 'Onboard your registered Kenyan logistics agency and entire courier squad. Bulk upload riders and manage team-level settlements.',
      's_d5184b': 'Own Vehicle required',
      's_d5e54c': 'Commercial Fleet Insurance Policy',
      's_d64903': 'NEXG remits compiled client transport payout settlements directly to your corporate account weekly on Mondays.',
      's_d66864': 'Flexible Shifts',
      's_d9863a': 'E.g. Fleet Manager',
      's_db3b79': 'Account Name',
      's_dca3fc': 'E.g. Westlands, Kilimani, Lavington',
      's_ddb4d1': 'E.g. Equity Bank',
      's_de744b': 'E.g. Mary Jane',
      's_e04a0d': 'Payout Settlement Configurations',
      's_e07446': 'Review pre-filled contract agreement clauses and apply your electronic signature.',
      's_e0934e': 'Date of Birth *',
      's_e12ee9': 'Preferred Transit Vehicle Assigned',
      's_e15c6c': 'Trading Name / Brand Name',
      's_e16a80': 'Document Verification Uploads',
      's_e1c6ae': 'Bulk CSV Squad Import',
      's_e1fe05': 'E.g. Albert Mwangi',
      's_e21ec5': 'Vehicle Model & Color',
      's_e387b2': 'Business KRA PIN',
      's_e3ca9b': 'E.g. John Kamau Maina',
      's_e4c574': 'E.g. +254 711 000 000',
      's_e7710e': 'Typed Electronic Signature preview',
      's_e7cfff': 'Authorized Signature Panel',
      's_e90701': 'Select Gender',
      's_eb6915': 'Fleet Integrity Declarations',
      's_ec9a3f': 'Estate Area / Street',
      's_ecd675': 'Vehicle Logbook & Third-Party Insurance',
      's_eeec98': 'Import CSV',
      's_ef8482': 'Choose Your Partnership model',
      's_efbb4c': 'E.g. Spouse / Parent',
      's_f3a211': 'E.g. +254 700 987 654',
      's_f4afb4': 'Choose your date of birth',
      's_f65568': 'E.g. +254 712 345 678',
      's_f6da6f': 'Personal Profile Details',
      's_f71ebc': 'E.g. John Kamau',
      's_f954ab': 'NEXG Fleet Operations',
      's_f9f8d5': 'Select the model that aligns with your assets. We have personalized contracts and onboarding checklist steps for each path.',
      's_fa0cdb': 'Total Active Riders',
      's_fbbe43': 'Configure how you receive settlements and who to contact in emergencies.',
      's_fca1ec': 'Ensure your details correspond exactly with your National Identification Document.',
      's_feb1b4': 'ID of the legal officer executing the Fleet Partnership Agreement.',
      's_febf86': 'Rider agrees to strictly wear the customized NEXG apparel on duty, maintain exemplary clean vehicle hygiene, arrive within specified time slots, and respect international hospitality guests\' absolute privacy. Failure to maintain a minimum 4.0/5.0 star rating may result in temporary profile deactivation.',
    },
    curatedNairobiWorlds: {
      's_15a714': 'Dynamic cross-category plans tailored to your moment, occasion & time of day',
      's_18a51d': 'Full Experience Builder',
      's_41dd82': 'Curated Nairobi Worlds',
      's_52c035': 'NEXG Experience Orchestrator',
      's_8abe87': 'Explore Offerings in Main Feed',
      's_c2018d': 'Contextual Experience Hub',
      's_ecc198': 'Click step to explore offerings',
      's_fe8da0': 'Nairobi Curated',
    },
    databaseSqlModal: {
      's_baaf3a': 'PostgreSQL Database Scripts',
    },
    dateTimeField: {
      's_46a299': 'Previous month',
      's_7ecc8b': 'Choose a year',
      's_8abf7c': 'Next month',
    },
    discoveryScreen: {
      's_030851': 'Merchant categories',
      's_0b7ee2': 'All verticals',
      's_176135': 'The API may not be running. Start it with',
      's_412226': 'Clear filters',
      's_67300d': 'Clear search',
      's_8344a6': 'Search merchants',
      's_a3c57f': 'No merchants found',
      's_dfe60c': 'Load more',
      's_f4d948': 'Search restaurants, spa, safaris, champagne, chauffeur, pharmacy...',
    },
    dishCustomizerModal: {
      's_052b34': 'Guest Satisfaction',
      's_062e79': 'Increase quantity',
      's_1c711d': 'Verified Diners Only',
      's_2db328': 'Any preferences? e.g. Extra dressing on side, cutlery needed...',
      's_492026': 'Add to Order',
      's_594a3d': 'Share what made this dish memorable...',
      's_6c02ab': 'Decrease quantity',
      's_70d3a5': 'Close modal',
      's_84ab4b': 'Submit Verified Review',
      's_9c0406': 'Suite / Villa (e.g. Penthouse 402)',
      's_a196bb': 'Customize & Options',
      's_bfae0e': 'Your Name (e.g. Eleanor V.)',
      's_d0fac0': 'Leave Your Dining Review',
      's_ece1f0': 'Special Kitchen Instructions',
    },
    dockedSearchBar: {
      's_67300d': 'Clear search',
    },
    experiences: {
      's_057742': 'Curated Experience Hosts & Outfitters',
      's_14c995': 'Book Date',
      's_574a76': 'Book Activity',
      's_63ae7c': 'Date & Time',
      's_6568e5': 'Your booking with',
      's_96ebfb': 'Search hosts, Maasai Mara, Giraffe Centre, cinema, safari...',
      's_9fda6b': 'Back to all Outfitters',
      's_a1e9f9': 'Explore Home',
      's_ad3a34': 'Private Safaris, Aerial Tours & Cultural Ateliers',
      's_cebc44': 'Choose an expert outfitter to browse hot-air balloon flights over the Mara, private giraffe conservation sanctuaries, and master artisan ateliers.',
      's_d29299': 'Bespoke Concierge Expeditions',
      's_eb9e1e': 'Confirm Booking',
      's_f6e8ce': 'Experience Reservation',
    },
    floatingCartBar: {
      's_f40d71': 'View Order',
    },
    forCouriers: {
      's_06816c': 'Apply to Drive',
      's_08c1c3': 'We provide access to high-quality vehicle maintenance programs, comprehensive courier insurance plans, and dedicated dispatch teams assisting you 24/7.',
      's_0c343a': 'Apply Online',
      's_0c8a9a': 'Terms of Service',
      's_0e840b': 'Pocket High Tips',
      's_110158': 'Help Center',
      's_153ab5': 'Idle Reduction',
      's_18414d': 'Elite Fleet',
      's_1bedd8': 'Ambassadors utilizing our suite-specific integrated routing enjoy significantly higher success ratings and earn double the average industry tips.',
      's_1d2be9': 'Safety Guidelines',
      's_209f63': 'Average Earnings Growth',
      's_22d1d3': 'Once you submit your application online, our onboarding team reviews documents within 48 hours. If qualified, you\'ll be invited for a brief physical assessment and standard white-glove training before your account goes active.',
      's_2a7274': 'Submit your vehicle registration and documents online in under 5 minutes through our secure, mobile-friendly onboarding portal.',
      's_2bf27f': 'STEP 01',
      's_2d816d': 'Career Advancement',
      's_2e6151': 'FLEET REQUIREMENTS',
      's_2ed1ed': 'Premium Payouts for Professional Ambassadors.',
      's_33b4c6': 'Join the Elite Fleet',
      's_3500ab': 'Join a community built on premium status and mutual respect. We support your career path and help you develop unmatched service skills.',
      's_355ac2': 'Deliveries per Day',
      's_38769a': 'For Properties',
      's_38df83': 'Estimate Earnings',
      's_39bc68': 'Your Vehicle Type',
      's_41493f': 'Join the Elite',
      's_42475b': 'Maintain exceptional ratings and receive daily performance multipliers and exclusive priority dispatcher pairing.',
      's_440245': 'The NEXG Driver App',
      's_45b640': 'Go online in the driver app, navigate to hot premium spots, complete high-end orders, and watch your mobile wallet balance swell.',
      's_4748c1': 'Receive clear, automated settlements straight to your bank or mobile wallet without delay, backed by detailed electronic statements.',
      's_4c36e1': 'SETUP TIMELINE',
      's_4d5b64': 'Ambassador Rating',
      's_4d81b2': 'STEP 03',
      's_4f555f': 'Track your daily performance, optimize your delivery times, and master Swahili & English hospitality tips with our smart companion analytics dashboard.',
      's_5150fd': 'Priority Routing Tech',
      's_52a6f3': 'For Partners',
      's_530246': 'Guaranteed Weekly Payouts',
      's_53cdfb': 'DATA INTELLIGENCE',
      's_54c4b5': 'Exceptional Presentation',
      's_5b8964': 'Guest Rating Profiles',
      's_5ce9fd': 'Fast Verification',
      's_5e7925': 'Our professional partner compliance team validates your records and issues a secure orientation invitation within 48 hours.',
      's_653ccb': 'We currently support major high-end neighborhoods and coastal luxury zones across Nairobi, Mombasa, and Diani, expanding quickly to other East African metropolitan areas.',
      's_677710': 'Route Efficiency Score',
      's_6bde0a': 'Apply Online Now',
      's_6d1c48': 'Earn stars and secure exclusive bonuses. Build private, anonymous reviews that reinforce your stellar reputation with premium hotels.',
      's_75dde0': 'Return to Guest App',
      's_765f2b': 'TRANSPARENT EARNINGS',
      's_777b12': 'Ambassador delivering gourmet meals',
      's_78df83': 'Powerful Analytics for Elite Drivers',
      's_7e32e7': 'Quick online onboarding. Submit details, attend orientation, retrieve your custom elite starter kit, and take your first order in under 48 hours.',
      's_7f255f': 'Deliver high-end products and culinary creations with meticulous care. Be dressed in custom-designed NEXG apparel to reflect elite standards.',
      's_8049d9': 'Weekly Payout Settlements',
      's_85cf78': 'No waiting for week-ends. Complete premium tasks and trigger instant payouts directly into your mobile wallet.',
      's_89bdbf': 'Elevating premium hospitality across East Africa with integrated, contactless concierge ecosystems.',
      's_8b1193': 'Understand your daily yields. Monitor peak areas, identify high-tipping zones, and learn the best hours to go online.',
      's_928714': 'Collect Starter Kit',
      's_933192': 'What it Takes to Be a NEXG Ambassador.',
      's_93a5bc': 'Exec Car',
      's_93fef0': 'Empowered Scheduling',
      's_95e986': 'Take complete control over your working hours. Plan your deliveries around peak fine-dining periods to lock in dynamic high fares.',
      's_97b846': 'Gain exclusive professional training in hospitality service, client management, and path leadership with certificates of excellence.',
      's_981b01': 'Premium Fleet Support',
      's_9ad0cc': 'Contact Us',
      's_9b1690': 'Apply to Fleet',
      's_9d3f52': 'Our advanced routing algorithms guide you efficiently to high-value destinations, minimizing idle mileage and maximizing deliveries per hour.',
      's_9db108': 'Privacy Policy',
      's_a08321': 'Redefining Delivery.',
      's_a1e9f9': 'Explore Home',
      's_a7acb1': 'Work according to your personal schedule. Take shifts during peak fine-dining hours for maximized yield.',
      's_a9577d': 'Secure Site',
      's_ad6c0d': 'KNOWLEDGE BASE',
      's_aed5c5': 'Must possess a clean driving record, valid local driver\'s license for your specified vehicle, and active comprehensive third-party insurance coverage.',
      's_b53080': 'Courier Partner FAQs',
      's_b74c4e': 'Toggle Theme',
      's_bc89aa': 'Empowered Flexibility',
      's_befa37': 'Ambassador scanning the driver app',
      's_c10fec': 'Flawless Modern Vehicle',
      's_c18810': 'Valid Documents & Licenses',
      's_c24cae': 'STEP 02',
      's_c38c49': 'Elite Rank Status',
      's_c71f96': 'Weekly Target Reached',
      's_c88176': 'Access culinary deliveries, spa wellness packages, and executive courier jobs cleanly integrated under a single, highly intuitive screen.',
      's_c887b9': 'About Us',
      's_ce60db': 'Own Your Earnings.',
      's_ce7472': 'Back to Home',
      's_d44881': 'Couriers Hero Background',
      's_d781b4': 'Operational Mapping',
      's_df9144': 'ELITE STANDARDS',
      's_e10068': 'Based on an average base fee of',
      's_e18d8e': 'Courier Earnings Estimator',
      's_e3a7a2': 'Direct payments made straight to your account every single week, with zero hidden fees.',
      's_e3b925': 'STEP 04',
      's_e6e178': 'Cookie Policy',
      's_e72e94': 'Earnings Analytics',
      's_eb35f1': 'Start your application today. Complete the secure onboarding questions and step into a new tier of professional independence and respect.',
      's_ec3c35': 'Stay updated with premier hospitality tips and trends.',
      's_eeb176': 'To guarantee top status, NEXG provides all approved couriers with premium tailored jackets, clean polo shirts, and custom-insulated delivery bags. Black trousers and clean black shoes are required on duty.',
      's_f370c7': 'Our app guides you right up to the designated suite or property zone, avoiding lobby confusion and ensuring frictionless drop-offs.',
      's_f582d4': 'Our dispatch systems minimize your empty miles. Pre-book orders or follow integrated corridors to stack high-paying jobs in a row.',
      's_f6e64a': 'Average Tip per Delivery',
      's_fbe3b3': 'Premium Integrated Hub',
      's_fcf600': 'Retrieve your tailored NEXG jackets, insulated food packs, smartphone bracket, and secure driver login credentials.',
      's_ff2382': 'Couriers Hero Daylight Background',
    },
    forMerchants: {
      's_032a19': 'Our professional curation experts ingest your items, style gorgeous visuals, and optimize layouts for direct contactless guest displays.',
      's_0c343a': 'Apply Online',
      's_0eaa2f': 'Right Where They Are.',
      's_118503': 'Merchants Hero Daylight Background',
      's_1600e2': 'Apply to Join NEXG',
      's_18414d': 'Elite Fleet',
      's_2bf27f': 'STEP 01',
      's_2f5b37': 'Merchant Support',
      's_38769a': 'For Properties',
      's_3f3d89': 'Zero integration headache. Submit your menu or catalogue, let us digitise your portal, and receive curated local sales in 48 hours.',
      's_4d81b2': 'STEP 03',
      's_52a6f3': 'For Partners',
      's_540349': 'Automated Revenue',
      's_591721': 'Higher Avg. Order Value',
      's_673bf7': 'Get paid on time, every time. Once a guest completes checkout, automated, secure merchant payouts route instantly to your bank.',
      's_750959': 'Applications are reviewed by our curation team within 24 hours to ensure our high standards of quality and service are maintained across the platform.',
      's_771412': 'Why Merchants Choose NEXG',
      's_7cb113': 'Multiply Volume',
      's_80b451': 'Instant Split Payouts',
      's_81df05': 'Consistent Orders',
      's_85feef': 'Premium Exposure',
      's_891482': 'We handle everything from digital menu formatting to custom checkout links. Absolutely no technical setup required on your end.',
      's_89a9da': 'Submit your fine dining menus, luxury spa offerings, or rental catalogs through our seamless, intuitive 2-minute onboarding form.',
      's_916b2f': 'Digital Integration',
      's_a1e9f9': 'Explore Home',
      's_a2e8c7': 'Receive Suite Orders',
      's_a92592': 'ONBOARDING TIMELINE',
      's_aa32fa': 'Start Onboarding',
      's_abafb4': 'Prepare packages meticulously. Professional NEXG couriers gather the items, fulfill deliveries, and secure payouts automatically.',
      's_ae23a7': 'Keep orders running flawlessly. Our active support concierge monitors deliveries live and assists with special suite requests.',
      's_b74c4e': 'Toggle Theme',
      's_ba7223': 'Commission on Pickups',
      's_c0228a': 'Reach Customers.',
      's_c24cae': 'STEP 02',
      's_c75030': 'Merchants Hero Background',
      's_c89f38': 'Partner with NEXG App to serve guests directly inside premier luxury properties. We provide white-glove logistics, automated payouts, and seamless integration with your existing team.',
      's_ce7472': 'Back to Home',
      's_ce9fe6': 'Never worry about transport. Our highly vetted professional courier fleet collects your packages and delivers them with elite standards.',
      's_d6626f': 'Zero Friction Setup',
      's_da08fb': 'Seamless Payouts',
      's_def7cc': 'Dedicated Support',
      's_e3b925': 'STEP 04',
      's_e56df8': 'WHY PARTNER WITH US',
      's_e6a013': 'Merchant Terms',
      's_e9cbdf': 'Verified Properties',
      's_f6538e': 'Tap into high-net-worth guests, tourists, and business travelers ordering gourmet meals, personal amenities, or spa treatments.',
      's_f6e1bd': 'Gain exclusive positioning in elite hotel room directories, high-visibility bedside QR cards, and digital concierge web-apps.',
      's_faae3e': 'As guests scan room QR codes, orders stream directly to your merchant dashboard with real-time audio and visual system notifications.',
      's_fe1a29': 'Contact Support',
    },
    forProperties: {
      's_0293af': 'Properties Hero Background',
      's_052b34': 'Guest Satisfaction',
      's_061f53': 'Curated local menus',
      's_06fb24': 'Integrate seamless, world-class concierge services into your luxury rentals and hotels. Empower guests to order gourmet food, book organic spa treatments, and request private transport with a single, contactless scan.',
      's_0a3693': 'Instant access, absolutely zero apps required',
      's_0c8a9a': 'Terms of Service',
      's_0d3b7b': 'Predict high-demand hours to allocate room cleaning, butler services, or external partner delivery drivers with supreme efficiency.',
      's_0e5ae2': 'Unified Service Hub',
      's_110158': 'Help Center',
      's_110820': 'Join hundreds of high-end resorts, boutique hotels, and luxury Airbnb hosts across East Africa that are boosting guest satisfaction and building zero-cost revenue.',
      's_176079': 'Preference Profiles',
      's_17d67c': 'Earnings Estimator',
      's_182ad0': 'Secure automated checkouts, verified premier concierge merchants, and licensed professional couriers guarantee safety and guest peace of mind.',
      's_18414d': 'Elite Fleet',
      's_1be9e5': 'Every QR code is uniquely tied to the guest suite, meaning food deliveries, room cleanings, or requested towels find guests exactly where they are.',
      's_1d2be9': 'Safety Guidelines',
      's_21f4bb': 'Happy Guests',
      's_25096d': 'Upfront Integration Cost',
      's_271358': 'Properties utilizing NEXG Contactless QR systems experience a massive increase in service engagement compared to conventional physical folders.',
      's_29b967': 'Properties CTA Sunset Background',
      's_2bf27f': 'STEP 01',
      's_31c559': 'Elevate Guest Experiences.',
      's_338ed9': 'Earn More Income',
      's_341a50': 'NEXG builds privacy-compliant guest preference profiles to help your staff pre-empt needs before they are even spoken out loud.',
      's_38769a': 'For Properties',
      's_3b6c18': 'Service Response Index',
      's_40c759': 'Average Occupancy Rate',
      's_4216f1': 'Trusted & Safe',
      's_46f477': 'Guests scan, order, and pay instantly. NEXG handles all fulfillment, depositing automatic commission shares to your dashboard.',
      's_49f179': 'We Handle Everything',
      's_4c36e1': 'SETUP TIMELINE',
      's_4d2dec': 'Local Adventures',
      's_4d81b2': 'STEP 03',
      's_4f7049': 'Estimated Monthly Share',
      's_4fdd58': 'Order Conversion Rate',
      's_52a6f3': 'For Partners',
      's_534294': 'We supply custom-crafted physical suite-specific QR cards. Place them in your room directories or high-visibility bedside tables.',
      's_53cdfb': 'DATA INTELLIGENCE',
      's_589ee1': 'Configure & Customise',
      's_5bfbb7': 'The QR Advantage',
      's_5fbc63': 'Unlock Property Potential.',
      's_70a8da': 'Stand Out',
      's_73ba7f': 'Chauffeurs & rentals',
      's_75dde0': 'Return to Guest App',
      's_785c45': 'Powerful Analytics for Modern Managers',
      's_7a1f3a': 'Position your properties as elite, technologically forward luxury destinations. Set a standard of hospitality others can\'t match.',
      's_7b1758': 'Private Cab & Car Hire shares',
      's_7bf908': 'Partner Onboarding',
      's_7c6eec': 'Transform guest behavior into highly actionable insights. Track ordering trends, optimize your staffing, and refine property offerings with real-time analytics.',
      's_7ee992': 'View Demo Video',
      's_818f94': 'Clear real-time transparency audit trail',
      's_8249e7': 'Food & Dining referrals',
      's_8332c9': 'Inventory Speed',
      's_872061': 'Deploy QR Displays',
      's_89bdbf': 'Elevating premium hospitality across East Africa with integrated, contactless concierge ecosystems.',
      's_8c288d': 'Submit your property and suite list online. Our concierge activation specialists verify your layout to launch your space.',
      's_8c8458': 'Why Hosts Choose NEXG',
      's_8d365a': 'Properties Daylight Hero Background',
      's_8e8592': 'Bespoke Tours & Safaris',
      's_8fe3e8': 'Apply & Partner',
      's_9ad0cc': 'Contact Us',
      's_9db108': 'Privacy Policy',
      's_9fd2f3': 'Stop leaving incremental hospitality revenue on the table. Our mutual commission-sharing model turns every guest service interaction into a direct revenue flow for your property, even when fulfilled entirely by trusted third-party merchants.',
      's_a1e9f9': 'Explore Home',
      's_a2cb3c': 'Guests simply point their camera and browse. No logins, no tedious app downloads, just premier high-end service in a couple of seconds.',
      's_a2f3a7': 'Enhanced Experience',
      's_a3fb7a': 'Fine Dining',
      's_a5d6a1': 'Zero integration overhead. Complete hotel setup, display delivery, and automatic digital catalog activation in under 48 hours.',
      's_a62509': 'REVENUE GENERATION',
      's_a9577d': 'Secure Site',
      's_a969aa': 'Safaris & excursions',
      's_a97bcc': 'Unlock a hands-off, zero-effort passive revenue stream by receiving high commission splits from every guest meal, ride, or tour booked.',
      's_aaa399': 'Passive Commissions',
      's_b74c4e': 'Toggle Theme',
      's_c24cae': 'STEP 02',
      's_c50b8f': 'Fully automated payouts and digital reporting',
      's_c5bb5d': 'Average Order Growth',
      's_c86934': 'Total Rooms / Suites',
      's_c887b9': 'About Us',
      's_c9bc84': 'Luxury Transport',
      's_cd4fe8': 'Partner with NEXG',
      's_ce7472': 'Back to Home',
      's_d08ccb': 'Zero Friction Interface',
      's_d15371': 'Delighted guests leave glowing feedback. Maximize your rating scores and booking ranks across Airbnb, Booking, and Expedia.',
      's_d178f4': 'Guest Habit Tracking',
      's_d300d6': 'Better Reviews',
      's_d5d3ea': 'We integrate premier local partner cuisines, spa offerings, and chauffeur fleets into a single, seamless brand-matching portal.',
      's_d8481d': 'Wellness & Spa',
      's_d887cc': 'Understand exactly what your guests prefer. Track peak booking periods, top fine dining cravings, and late-night requests.',
      's_e09921': 'Operational Optimization',
      's_e3b925': 'STEP 04',
      's_e56df8': 'WHY PARTNER WITH US',
      's_e6e178': 'Cookie Policy',
      's_e7f7ee': 'More Bookings',
      's_e87389': 'Loyalty Return Intent',
      's_ea763f': 'Apply for Partnership',
      's_ec3c35': 'Stay updated with premier hospitality tips and trends.',
      's_ee7b88': 'We seamlessly integrate previously fragmented premium local merchants into an elegant singular user experience reflecting your property’s status.',
      's_f04a9d': 'Absolutely zero operational burden for you. From partner restaurant execution to vetted courier logistics, NEXG does all the heavy lifting.',
      's_f59c46': 'Monetize Every Single Stay.',
      's_f77be3': 'Luxury suite with guest scanning QR code',
      's_f90548': 'Deliver unmatched, instant room service, organic spa appointments, and curated local safaris at the simple scan of a finger.',
      's_f907f8': 'One Elite App. Infinite Services.',
      's_fa3fc3': 'Average App Spend per Stay',
      's_fe3f95': 'THE ECOSYSTEM',
    },
    googleReviewsModal: {
      's_0d75a8': 'Google Maps Pin',
      's_273f6f': 'No Google reviews match your selected filter.',
      's_3ea133': 'Verified direct contacts & socials',
      's_6913b8': 'Search reviews for dishes, ambiance, speed...',
      's_6a6eaf': 'Filter by Stars',
      's_6bce42': 'Verified Aspect Scores',
      's_aaf427': 'Atmosphere & Reliability',
      's_ba9553': 'Quality & Execution',
      's_bd9554': 'Reviews synced in real-time with Google Places API',
      's_c34ae8': 'Aspect data collected via Google Places API',
      's_cbac3e': 'App Service',
      's_d45c4f': 'Official Portal',
      's_d6f49f': 'Verified Google Reviews',
    },
    groceriesPage: {
      's_160a42': 'Back to all Purveyors',
      's_340a24': 'Gourmet Cellar & Purveyors',
      's_48028b': 'Artisanal Cellar, Caviar & Fromagerie',
      's_504097': 'Fine Cellar & Epicurean Purveyors',
      's_7447ef': 'Search purveyors, caviar, Dom Pérignon, Bellota, truffles...',
      's_828ad2': 'Insulated Cold Packaging',
      's_a1e9f9': 'Explore Home',
      's_dcc1fb': 'Select Item',
    },
    header: {
      's_64f892': 'Toggle Light/Dark Theme',
      's_7abd6c': 'View Cart',
    },
    hero: {
      's_67300d': 'Clear search',
      's_7ecda2': "Chakula cha kifahari kwenye penthouse usiku pamoja na mandhari ya jiji",
      's_c75a68': "Bwawa la kifahari lisilo na ukingo kwenye penthouse yenye mwanga wa jua na mandhari ya jiji",
      's_ece6e2': "Chumba cha kifahari cha simu wakati wa usiku",
    },
    hostOnboarding: {
      's_00679c': 'Who fulfills it?',
      's_013237': 'Use my location',
      's_0302c0': 'Reception desk, access code process, security desk, host contact, etc.',
      's_0d3b1e': 'Host Portal',
      's_10599c': 'Property name',
      's_10a49a': 'Add a space / unit type',
      's_120c32': 'How are guests identified within the property?',
      's_12e078': 'Name / label',
      's_1596ef': 'Bring your property into NEXG.',
      's_193de6': 'Your host application for',
      's_205866': 'Landmarks, gate instructions, building name, entrance, etc.',
      's_20687f': 'Settlement account',
      's_25916d': 'Price (optional)',
      's_25e7e1': 'Tell guests about the property',
      's_272c68': 'Property features',
      's_292d45': 'Examples of guest requests',
      's_2bbda0': 'For NEXG App Limited',
      's_33becf': 'You\'re ready for verification.',
      's_369c34': 'Property partner',
      's_3cc2c7': 'Signature pad',
      's_415e74': 'Guest capacity',
      's_421a0f': 'Short description of the property, atmosphere and what makes it distinctive...',
      's_486ffa': 'Authorized representative',
      's_49e09b': 'Tax / pricing setup',
      's_4a9200': 'Property / operating permit',
      's_4e17c4': 'By signing below, the authorized representative confirms that the submission is accurate and accepts the applicable NEXG host partnership terms presented during onboarding.',
      's_58eafa': 'Typical request fulfillment time',
      's_616ace': 'Legal / operating entity',
      's_62a764': 'If applicable',
      's_6372ac': 'Host onboarding',
      's_67745b': 'Start another',
      's_692b50': 'Building, street or road',
      's_7013c7': 'The Host remains responsible for the operation, safety, licensing, staffing, availability, pricing and fulfillment of property services. NEXG may coordinate guest requests, transactions and related workflows according to the agreed configuration.',
      's_75d65e': 'Your progress is saved locally on this device.',
      's_773613': 'Rooms / units',
      's_782667': 'HOST SETUP',
      's_7af122': 'Tap or click the map to set the exact property point.',
      's_7b12e1': 'Add the requests your team actually handles today.',
      's_7bba35': 'Property cover image',
      's_810878': 'Tell us what exists, what guests can access, and how your team operates. We\'ll use this to build your property profile and guest experience.',
      's_82c7e7': 'Back to the host portal',
      's_849305': 'Signature method',
      's_86adcf': 'Year opened',
      's_893bd7': 'Authorized signatory name',
      's_897c71': 'Clear signature',
      's_8ad7ea': 'Property type',
      's_8dc8f7': 'What would you like NEXG to help you expose to guests?',
      's_8e3c7a': 'Website / booking page',
      's_924da1': 'Describe your property type',
      's_93cfd5': 'What kind of property is it?',
      's_9550a5': 'Departments / teams available',
      's_99d32f': 'Back to host portal',
      's_9d617c': 'What can guests access or request?',
      's_a2a1b1': 'The Host agrees to maintain accurate property information and reasonable service availability, and to notify NEXG of material changes that could affect guest fulfillment.',
      's_a68df4': 'Check-in / arrival instructions',
      's_a6d2ea': 'The Host confirms that the information supplied about the property, its operating model, guest-accessible spaces and services is accurate to the best of their knowledge and that they are authorized to provide it.',
      's_a8dc5c': 'What does the property include?',
      's_aa1d9b': 'What do you want guests to transact for?',
      's_ae7f40': 'Check-out time',
      's_b45dc8': 'Anything you currently struggle to make visible, bookable, purchasable or easy for guests to request...',
      's_b501d3': 'Request / service',
      's_b50578': 'Upload square logo',
      's_b5508b': 'Property setup',
      's_be3ecd': 'Account holder name',
      's_bf72f7': 'Settlement details should be verified before activation. Do not use this form for card or wallet credentials.',
      's_c0b7d7': 'Pin the property',
      's_c250a9': 'Property access',
      's_c36127': 'Save / Print',
      's_ca1948': 'For Host',
      's_ca9b4a': 'How should guests find you?',
      's_cde9a5': 'Optional notes, amenities or access details',
      's_ce9840': 'Submitted information may be reviewed for onboarding, verification, operations, support, settlement and guest-experience purposes. Additional verification may be requested before activation.',
      's_d1d7c9': 'Full legal name',
      's_d90fdd': 'Operating model',
      's_e400b7': 'How do guest requests reach your team today?',
      's_e45952': 'Who should receive NEXG requests?',
      's_e4cee9': 'Application received',
      's_e61a08': 'M-PESA Till / Paybill',
      's_e9c696': 'Are you onboarding more than one property?',
      's_eb7eb7': 'Choose file',
      's_ecc61a': 'Please complete the highlighted fields before continuing.',
      's_edbfdd': 'Property logo',
      's_f0ac0a': 'Pending verification',
      's_f548ec': 'Business / registration document',
      's_f71497': 'Check-in time',
      's_faea7e': 'NEXG App Limited',
      's_fbd2e5': 'Registered company or operating name',
      's_ff1835': 'NEXG Operations',
    },
    languageSwitcher: {
      's_03e64a': "Badilisha lugha (Kiingereza, Kichina, Kiswahili, Kiarabu)",
      's_99547d': "Chagua lugha na eneo",
      's_b8cc8e': "Kichaguaji cha lugha",
    },
    merchantAdCarousel: {
      's_297522': 'Sponsored partner offers',
      's_2d4e52': 'PARTNER SPOTLIGHT',
      's_3340de': 'Exclusive host and verified partner privileges',
      's_430fac': 'Enable location to see trending offerings near you',
    },
    merchantCard: {
      's_3beea0': 'Save to favorites',
      's_960d55': 'Popular offerings',
    },
    merchantItemModal: {
      's_062e79': 'Increase quantity',
      's_6c02ab': 'Decrease quantity',
    },
    merchantOnboarding: {
      's_00b623': 'Upload business certificates and company logos. These will be used to dynamically set up your store theme inside the NEXG customer application.',
      's_012a51': 'Please register the legal trading entities. Correct tax identifiers help guarantee smooth fast payouts.',
      's_01edab': 'Search Location Finder',
      's_02aa9a': 'Input branch parameters. You can search using Nominatim autocomplete finder or drop coordinates via the map.',
      's_0bd62e': 'Account Number',
      's_0cb1d6': 'Authorized Officer Signature',
      's_108c09': 'NEXG Riders Fleet',
      's_197803': 'Above 60 minutes',
      's_1c7169': 'Logo preview',
      's_1cf31b': 'Generated via map picker',
      's_20f7df': 'Closing Time *',
      's_21f543': 'Facebook page',
      's_22691e': 'Provide a brief summary of specialties, offerings, or history (max 150 characters)',
      's_26a2ff': 'Based on your category, select common sections to organize your items or add custom ones.',
      's_2eabdb': 'Partnership Agreement Contract',
      's_312631': 'Bank Name',
      's_39e42f': 'Interactive catalog listing on the premium NEXG Client App.',
      's_3e95c1': 'Nominate your payouts destinations. Weekly settlements are transferred directly every Monday morning.',
      's_3fa081': 'You selected',
      's_411097': 'None selected yet. Choose suggestions or add a custom one below.',
      's_4331e0': 'Holiday Closing Time',
      's_4baf91': 'Short Business Description',
      's_4f2047': 'Maintain exact availability schedules, correct pricing, and stock sync lists.',
      's_540d0d': 'Suggested Sections',
      's_550c6f': 'Register primary coordinates. Authorized officers receive system orders, accounts payouts auditing details, and alerts.',
      's_5664e0': 'The Merchant is solely responsible for clearing customs duties, port levies, and ensuring all shipping cargo meets international and local compliance standards.',
      's_59c22e': 'Upload Banner Image',
      's_5fa789': 'You can select multiple specific types if your outlet handles different luxury segments.',
      's_676418': 'Business Paybill No.',
      's_67de19': 'Provide premium white-glove deliveries & concierge orders to luxury customers in Kenya.',
      's_7122f5': 'Business Profile',
      's_71c904': 'NEXG APP LIMITED',
      's_721462': 'Director ID / Passport Scan',
      's_7308b8': 'Review the pre-drafted legal contract. Ensure all merchant parameters, locations, and banking details are correct.',
      's_8242a9': 'Upload business registration scan PDF or image.',
      's_85273b': 'Confirm Coordinates',
      's_869b48': 'NEXG Legal Representative',
      's_87a51d': 'Own Store Riders',
      's_89ac4c': 'Hours Configuration Template',
      's_8c1404': 'Instagram profile',
      's_91091f': 'Type landmark e.g. Yaya Centre, Westlands, Sarit...',
      's_91dd0b': 'TikTok profile',
      's_928d67': 'Coordinates Map Link',
      's_9441e0': 'Branch Manager / Contact Person',
      's_959d0c': 'For NEXG APP LIMITED',
      's_963f97': 'Average Preparation Time',
      's_9d4f8b': 'Type your full legal name',
      's_a03653': 'Expand Your Business with NEXG',
      's_a0b2cf': 'Search categories e.g. Food, Safe, Spa, Flight...',
      's_a133eb': 'Click to add',
      's_a4d472': 'NEXG operates logistics carriage from your store using our background-checked professional couriers.',
      's_a5d0ab': 'Certificate of Registration',
      's_abf9f4': 'Banner preview',
      's_b03404': 'Your premium merchant onboarding is complete. Our partnership audit committee will complete verify checks and activate your store front within 24 hours.',
      's_b32233': 'Website URL',
      's_b62775': 'Upload ID or passport of major primary director.',
      's_b639de': 'Add Section',
      's_b8579d': 'Payment Details',
      's_b9084a': 'Choose Category',
      's_b9f2b1': 'Operating Days',
      's_b9ffbd': 'Merchant Partnership Agreement',
      's_bb20e3': 'For THE MERCHANT',
      's_c05283': 'Choose the category that best aligns with your merchant store operations. Use search or filter down instantly.',
      's_c5955e': 'Opening Time *',
      's_c6846b': 'Signature drawing',
      's_d1bf6b': 'Kenyan Public Holidays Availability',
      's_d1d21f': 'Collection and processing of accounts charges from guests, tourists, and corporate networks.',
      's_d33bf6': 'Merchant Portal',
      's_d7a397': 'Branch Contact Phone',
      's_d890b7': 'Branch Location',
      's_db3b79': 'Account Name',
      's_e0a26d': 'Logistics carriage orchestration based on requested parameters.',
      's_e58331': 'Handwriting Style Preview',
      's_e79369': 'Store Branches & Location Map',
      's_eab077': 'Delivery Carriage Modes',
      's_eab952': 'WhatsApp Dispatch No.',
      's_ebaf4a': 'Paybill Account Name',
      's_ed6a3f': 'Holiday Opening Time',
      's_f1dd4c': 'Buy Goods Till No.',
      's_f7c245': 'Onboard Another Store',
      's_faea7e': 'NEXG App Limited',
    },
    merchantPage: {
      's_c902a1': 'Open Now',
    },
    merchantPreviewSheet: {
      's_0f4c5c': 'This merchant does not declare its own workflow, so the default for its category is shown.',
      's_28da6e': 'See all offerings',
      's_baa550': 'Close preview',
    },
    merchantRoute: {
      's_176135': 'The API may not be running. Start it with',
      's_a1ca54': 'Loading merchant',
      's_e84712': 'Go back',
    },
    merchantView: {
      's_085b31': 'No offerings listed yet',
      's_3fcbae': 'Menu sections',
      's_67300d': 'Clear search',
    },
    metricsDashboard: {
      's_048f2f': 'Status breakdown',
      's_0dd383': 'API version',
      's_1c8836': 'Built at',
      's_235f7b': 'Events accepted',
      's_236a59': 'Bars are per-bucket counts derived from the API\'s cumulative Prometheus buckets.',
      's_266384': '5xx error rate',
      's_406acb': 'Requests / minute',
      's_41e8de': 'Recent traces (/api/traces)',
      's_461aff': 'No spans buffered yet.',
      's_58b6dc': 'In flight',
      's_5dd968': 'Events dropped',
      's_65916f': 'Browser events arrive only from visitors who granted analytics consent.',
      's_74d595': 'No metrics available',
      's_74efa0': 'Metrics API unreachable.',
      's_75e157': 'The dashboard polls',
      's_8474ec': 'No samples yet.',
      's_886fb2': 'Client telemetry',
      's_9d5b00': 'Slowest routes (by p95)',
      's_a41501': 'Runtime, build and data source',
      's_b0ad50': 'No routes recorded yet.',
      's_c347b1': 'Service metrics',
      's_cc1e6a': 'Duration histogram',
      's_cec477': 'Last 60s',
      's_e4076f': 'Collecting samples. The line appears after the second poll.',
      's_ee9d59': 'Database reads',
      's_f8fd6e': 'No responses recorded yet.',
      's_ffb77d': 'Data source',
    },
    nexGCategoryDrilldown: {
      's_03f70c': 'Merchant Providers & Partners',
      's_09efe8': 'Choose a time',
      's_0df6f0': 'Switch Provider',
      's_0ecb20': 'Confirm & Reserve Instant Dispatch',
      's_126f44': 'Preferred Time',
      's_19ad69': 'Scheduled Date',
      's_1b8543': 'Reset All Filters',
      's_1f647f': 'Special Offers',
      's_27c636': 'Complete view',
      's_2994b4': 'Scroll right',
      's_2c9e5a': 'Scroll left',
      's_2f1873': 'All Items',
      's_34318e': 'Rating 4.8+',
      's_492026': 'Add to Order',
      's_4ce3f0': 'Select a Merchant Provider Above',
      's_50238f': 'No upfront charge. Escrow reservation handled by concierge desk.',
      's_543b1b': 'Your reservation for',
      's_5be698': 'Reset Filters',
      's_77bf79': 'Reserve / Book',
      's_7db318': 'Back to Discovery',
      's_8978ea': 'Decision Specifications',
      's_8bf67b': 'Nairobi Luxury District',
      's_9dca31': 'No items found matching your filters.',
      's_ab2d11': 'Under 25 min',
      's_c07c6d': 'Suite Number or Location Notes',
      's_c14e04': 'Browse catalog offerings with real-time pricing and availability',
      's_c25b51': 'Strict Category & Subcategory Catalog',
      's_d394a9': 'Highest Rated',
      's_e16a1d': 'Explore dedicated subcategories with specialized imagery and custom parameters',
      's_eb13c4': 'To view item cards, please click any of the verified merchant providers above. Their full 30-item catalog, specifications, and instant ordering will appear here.',
      's_fae58c': 'Clear Selection',
      's_fcdcf7': 'Fast selections & customer favorites',
    },
    nexGCollectionRail: {
      's_0b3917': 'Curated Collection',
      's_2994b4': 'Scroll right',
      's_2c9e5a': 'Scroll left',
      's_986032': 'Explore All',
    },
    nexGDiscoveryView: {
      's_6d9483': 'Browse verified Nairobi merchants across 20 neighborhoods with Wolt-grade previews',
      's_741311': 'Search food, spa, safaris, champagne, chauffeur...',
      's_76cb8c': 'Previous categories',
      's_844b94': 'Next categories',
      's_8f8796': 'High-priority concierge delivery direct to your suite or villa in under 30 minutes',
      's_a9176a': 'Explore Verticals & Categories',
      's_b0a3fc': 'All Verified Partners & Merchants',
      's_df4cf6': 'Instant Suite Express',
    },
    nexGEntityCard: {
      's_085ed0': 'View catalog & pricing',
    },
    nexGItemSheet: {
      's_0932f6': 'Special App Notes or Dietary Preferences',
      's_22b77f': 'Appointment & Scheduling',
      's_24a16c': 'Session Duration',
      's_3beea0': 'Save to favorites',
      's_65d22e': 'Close sheet',
      's_68f2d8': 'Preferred Date',
      's_693039': 'Time Slot',
      's_a99ee2': 'Number of Guests / Attendees',
      's_c6cf76': 'Added to Experience Order',
      's_d0e359': 'Curated Enhancements & Add-ons',
      's_eeea54': 'NEXG App Guarantee',
    },
    nexGLandingHero: {
      's_0b8149': 'Sign up',
      's_2bd100': 'Enter delivery address, villa or hotel suite...',
      's_381d79': 'Nairobi Villas',
      's_52a6f3': 'For Partners',
      's_71a30d': 'Change Delivery Location',
      's_e17357': 'Active App Fleet in Nairobi',
      's_f7c400': 'Log in',
      's_fa918a': 'Locate my position',
    },
    nexGSearchEngine: {
      's_c5b914': 'No direct matches found',
      's_cd81f4': 'Search Results for',
    },
    offercarousel: {
      's_10bb09': 'Previous Slide',
      's_2aa5dc': 'View Offer',
      's_7141bc': 'Next Slide',
    },
    orderTrackingModal: {
      's_116632': 'Estimated Delivery',
      's_375813': 'Fast forward simulation to next lifecycle stage',
      's_43301e': 'Call Courier',
      's_536456': 'Courier Tip',
      's_61243a': 'Simulated Payment Method',
      's_6e6109': 'Copy delivery security PIN',
      's_74e226': 'Itemized Receipt & PIN',
      's_84e3ee': 'Dismiss / Back to App',
      's_976a74': 'Transaction Reference',
      's_9c12c6': 'Delivery Fee',
      's_9ca905': 'This is an automated simulation of the client ordering lifecycle in NEXG App. No actual payment provider has been billed. Once connected to the live API gateway, genuine payments will be processed via M-Pesa or Stripe.',
      's_9fb5a8': 'Delivery PIN',
      's_a392ce': 'Live Progress Stages',
      's_b868ce': 'Message Courier',
      's_cbac3e': 'App Service',
      's_cd1876': 'Your Location',
      's_d6e963': 'Minimize tracking',
      's_ea2152': 'Live Journey & ETA',
      's_f56564': 'On schedule',
    },
    productcarousel: {
      's_10bb09': 'Previous Slide',
      's_7141bc': 'Next Slide',
    },
    promo: {
      's_38769a': 'For Properties',
      's_4a421c': 'For Merchants',
      's_c63982': 'For Couriers',
      's_d2c984': 'NEXG App App Interface',
    },
    restaurantDetailModal: {
      's_034ad6': 'Recent Google Reviews',
      's_116c19': 'Hospitality & Service',
      's_3beea0': 'Save to favorites',
      's_4f2130': 'Google Restaurant Reviews',
      's_52aed7': 'Food Quality',
      's_56ba29': 'No dishes match your search criteria.',
      's_649ff9': 'Add to order',
      's_652bc8': 'Posted on Google',
      's_79db72': 'View & Write Reviews',
      's_79fe15': 'View Google Reviews',
      's_9c203d': 'Artisanal Menu',
      's_9f068b': 'Verified Place',
      's_a023e6': 'Chef Pick',
      's_b05630': 'Synced Live',
      's_b38795': 'Search dishes...',
      's_c152be': 'No Google reviews loaded for this venue.',
      's_e1c6bf': 'Atmosphere & Transport',
      's_f4657b': 'Google Maps Rating',
    },
    restaurants: {
      's_0721cf': 'Your reservation at',
      's_072c89': 'Reserve Table',
      's_0c8f01': 'Table Reservation',
      's_25b120': 'Selected Reservation',
      's_2c3b25': 'Confirm Table',
      's_34df71': 'Search dining partners, sushi, dry-aged steaks, pasta...',
      's_4f9fa0': 'Google Maps Location',
      's_5be698': 'Reset Filters',
      's_5f716b': 'Try adjusting your search keywords or resetting cuisine filters.',
      's_6b2c05': 'Fine Dining Partners',
      's_7288fd': 'Fine Dining Partners & Master Chefs',
      's_868fb0': 'Click any dish to configure ingredients, accompaniments, or place a simulated order',
      's_99256e': 'Curated Culinary Directory',
      's_9da221': 'Featured Partner',
      's_a1e9f9': 'Explore Home',
      's_ae0cb2': 'Signature Dishes & Menu Offerings',
      's_bf0c7d': 'Back to all Dining Partners & Merchants',
      's_cfdf8b': 'Search menu dishes...',
      's_d97dd5': 'View Google Reviews & Diner Insights',
      's_dde236': 'Customize & Order',
      's_e25e77': 'Select a merchant to explore their Michelin-grade menu, signature dishes, verified Google diner reviews, and table reservations.',
      's_eac205': 'No dining partners match your filters',
    },
    routeFallback: {
      's_1c5772': "Ukurasa unapakia",
    },
    scrollToTop: {
      's_f07710': "Rudi juu ya ukurasa",
    },
    spaBookingModal: {
      's_039d05': 'Experience Setting',
      's_09121f': 'Appointment Slot',
      's_15ddf4': 'District Wellness Experience',
      's_17548b': 'Slot Scheduled',
      's_2fd731': 'Signature Aromatherapy Oil',
      's_301d19': 'Live Dispatch Progress',
      's_4548b7': 'Our certified therapist will arrive 10 minutes prior with sanitized organic towels, ultrasonic mist diffuser, and a heated memory-foam bed.',
      's_485336': 'Villa / Suite Number',
      's_4b8ec9': 'Private In-Villa Sanctuary',
      's_5621b9': 'Focus Areas & Medical Notes',
      's_712231': 'Contact Spa Concierge',
      's_7d1e9d': 'Private oceanfront cabana with thermal plunge pool & tranquil zen garden access.',
      's_8cff8d': 'Total Experience Fee',
      's_9092d9': 'Add to Calendar',
      's_9505aa': 'Total Concierge Charge',
      's_950d86': 'Massage Pressure Preference',
      's_9a36a0': 'Confirm Spa Booking',
      's_9e603c': 'Therapist dispatches directly to your villa with heated table, organic linens & aromatherapy.',
      's_a027ba': 'Select Ritual Duration',
      's_b3a5a1': 'Concierge In-Villa Service Protocol',
      's_be9475': 'Therapist Preference',
      's_c0a672': 'Appointment Confirmed',
      's_c8c5fe': 'Primary Guest Name',
      's_f00e02': 'Assigned Master Therapist',
      's_f79d9c': 'Resort Spa Pavilion',
    },
    spaWellness: {
      's_120405': 'Select Ritual',
      's_3669be': 'Book Calendar',
      's_5276ac': 'Your appointment at',
      's_5dfb4e': 'Spa & Wellness Sanctuaries',
      's_659a92': 'Search spa sanctuaries, Balinese, deep tissue, sauna...',
      's_689bea': 'Back to all Sanctuary Partners',
      's_69d23c': 'District Holistic Wellness & Spa',
      's_9aabe9': 'Book Session',
      's_a1e9f9': 'Explore Home',
      's_c1c2fb': 'Sanctuary Spas & In-Villa Wellness',
      's_d02cb4': 'Search rituals & massages...',
      's_eb9e1e': 'Confirm Booking',
      's_f212ea': 'Spa Sanctuary Reservation',
      's_f2937f': 'Select duration, botanical essential oils, and schedule an immediate in-villa or pavilion appointment',
      's_fda6e0': 'Select a wellness sanctuary to browse certified therapists, in-villa Balinese massages, Ayurvedic Shirodhara, and hydrothermal rituals.',
      's_fe0476': 'Sanctuary Treatments & In-Villa Rituals',
    },
    stats: {
      's_034abd': 'From hotels to homes, we make everyday exceptional.',
      's_826dd3': 'Hotel Partners',
      's_bd3fa2': 'Our Partners',
      's_dc04b9': 'Dar es Salaam',
      's_e819e6': 'Concierge Support',
      's_f2a377': 'Trusted by guests',
    },
    transportBookingModal: {
      's_1505c5': 'Live Dispatch Status',
      's_160ad9': 'Chauffeur Confirmed',
      's_251e18': 'Dedicated Chauffeur Hours',
      's_314bee': 'Total Concierge Fee',
      's_358b66': 'Pickup Time',
      's_36a60c': 'Done & Return to App',
      's_39b21c': 'Call Chauffeur',
      's_457b66': 'Total Rate',
      's_6f672b': 'Assigned Chauffeur',
      's_77ae94': 'Scheduled Departure',
      's_7a4175': 'Schedule Date',
      's_8941e9': 'Service Type',
      's_8dea76': 'Pickup Location',
      's_99d1c7': 'Confirm VIP Chauffeur',
      's_9ca1bd': 'Day After',
      's_a1cbc4': 'VIP Meet & Greet + Airport Flight Sync',
      's_b68827': 'Villa / Suite Room',
      's_be057d': 'Guest Name',
      's_cd11b4': 'Complimentary On-Board Amenities',
      's_d0cd2d': 'Flight Number / Departure Code',
      's_efb6c4': 'Continue to Amenities',
      's_f2f922': 'VIP Concierge Mobility',
    },
    transportPage: {
      's_1836d5': 'Choose a luxury mobility merchant to view available Maybach S680s, Rolls-Royce Ghost motorcars, Cadillac Escalade ESVs, or twin-engine helicopter transfers.',
      's_1afb28': 'Back to all Mobility Partners',
      's_2ea911': 'Chauffeur Reservation',
      's_3390d4': 'Reserve Chauffeur',
      's_3727e7': 'Book Transfer',
      's_52b224': 'VIP Chauffeur & Mobility Providers',
      's_543b1b': 'Your reservation for',
      's_784e6e': 'Search mobility providers, Maybach, Rolls-Royce, helicopter...',
      's_875bd6': 'Executive Chauffeurs & Private Aviation',
      's_898adc': 'VIP White-Glove Mobility',
      's_93f4b8': 'Pickup Date & Time',
      's_a1e9f9': 'Explore Home',
      's_eac49e': 'Book Vehicle',
      's_eb9e1e': 'Confirm Booking',
    },
    unifiedItemModal: {
      's_0125ec': 'View All Reviews',
      's_1cc3d0': 'Aromatherapy Essential Oil',
      's_3c0047': 'Dedicated Appointment Calendar',
      's_4c13f0': 'App Notes & Villa Details',
      's_5d14d6': 'E.g. Villa Suite 402, gate access code, dietary allergies, or arrival notes...',
      's_94c578': 'Confirm Calendar Reservation',
      's_a027ba': 'Select Ritual Duration',
      's_bf3b18': 'Add to App Cart',
      's_ee3e2e': 'About this offering',
      's_ee749a': 'Total Estimate',
    },
  },

  /*
    SHARED FORM VOCABULARY.

    These are the strings that appear on more than one form — an email label on four onboarding
    flows, "Save draft" on three. Extracting them means a later component references a key that
    already exists rather than adding a fifty-first way to say "Full name".

    Scoped deliberately: it holds what is genuinely common and nothing else. Form-specific copy
    ("Driver's License Expiry Date", "E.g. KMCA 123A") stays with its own screen, because
    collecting one-off strings into a shared block is how a shared block becomes unmaintainable.

    Placeholders use {braces} where a value is substituted. See forms.stepOf.
  */
  forms: {
    actionSave: 'Hifadhi',
    actionSaveDraft: 'Hifadhi rasimu',
    actionContinue: 'Endelea',
    actionBack: 'Rudi',
    actionNext: 'Ifuatayo',
    actionCancel: 'Ghairi',
    actionConfirm: 'Thibitisha',
    actionSubmit: 'Wasilisha',
    actionReview: 'Kagua',
    actionEdit: 'Hariri',
    actionRemove: 'Ondoa',
    actionUpload: 'Pakia',
    actionTryAgain: 'Jaribu tena',
    fullName: 'Jina kamili',
    emailAddress: 'Barua pepe',
    phoneNumber: 'Namba ya simu',
    whatsappNumber: 'Namba ya WhatsApp',
    nationalId: 'Namba ya kitambulisho',
    dateOfBirth: 'Tarehe ya kuzaliwa',
    county: 'Kaunti / mkoa',
    addressStreet: 'Anwani / mtaa',
    areaNeighbourhood: 'Eneo / mtaa',
    preferredContact: 'Njia unayopendelea ya mawasiliano',
    documentType: 'Aina ya hati',
    documentUpload: 'Pakia hati',
    documentExpiry: 'Tarehe ya mwisho',
    businessRegistration: 'Hati ya usajili wa biashara',
    taxPin: 'Namba ya kodi',
    certificateOfIncorporation: 'Cheti cha usajili',
    bankName: 'Jina la benki',
    accountName: 'Jina la akaunti',
    accountNumber: 'Namba ya akaunti',
    branchName: 'Tawi',
    mobileMoneyNumber: 'Namba ya pesa za simu',
    paymentMethod: 'Njia ya malipo',
    chooseDate: 'Chagua tarehe',
    chooseOption: 'Chagua chaguo',
    selectYourRole: 'Chagua jukumu lako',
    yes: 'Ndiyo',
    no: 'Hapana',
    optional: 'Si lazima',
    required: 'Lazima',
    thisFieldRequired: 'Sehemu hii inahitajika',
    enterValidEmail: 'Weka barua pepe sahihi',
    enterValidPhone: 'Weka namba sahihi ya simu',
    selectOneOption: 'Tafadhali chagua chaguo',
    uploadRequired: 'Tafadhali pakia hati inayohitajika',
    stepOf: 'Hatua {current} kati ya {total}',
    unsavedChanges: 'Una mabadiliko ambayo hayajahifadhiwa',
    placeholderFullName: 'Jina lako kamili',
    placeholderEmail: 'wewe@example.com',
    placeholderPhoneKe: '+254 7XX XXX XXX',
    placeholderExample: 'Mfano: {value}',
  },
    nav: {
      home: 'Mwanzo',
      explore: 'Gundua',
      restaurants: 'Vyakula Bora',
      spa: 'Spa & Afya',
      spaDistrict: 'Kitengo',
      transport: 'Magari ya Kifahari',
      groceries: 'Vinywaji Bora',
      experiences: 'Matukio Maalum',
      partners: 'Washirika',
      forProperties: 'Kwa Hoteli & Majengo',
      forCouriers: 'Kwa Madereva wa Fleet',
      forMerchants: 'Kwa Wafanyabiashara',
      partnerOnboarding: 'Kujiunga na Ushirika',
      applyFleet: 'Omba Kujiunga na Fleet',
      listBusiness: 'Sajili Biashara Yako',
      track: 'Fuatilia',
      viewCart: 'Kikapu Changu',
      appearanceMode: 'Muonekano',
      lightMode: 'Mwangaza wa Mchana',
      darkMode: 'Giza la Usiku',
      selectLanguage: 'Chagua Lugha',
      menu: 'Menyu',
      close: 'Funga',
    },
    hero: {
      badge: 'Huduma Maalum ya App ya Kifahari',
      titleLine1: 'Kila kitu unachohitaji,',
      titleLine2: 'pale pale ulipo sasa.',
      subtitle: 'Agiza vyakula bora kutoka kwa wapishi mashuhuri, weka miadi ya masaji ya utulivu wa hali ya juu, agiza madereva wa VIP Maybach, na ufurahie uwasilishaji wa haraka moja kwa moja kwenye villa au chumba chako.',
      searchPlaceholder: 'Tafuta chakula, spa, gari',
      searchBtn: 'Tafuta',
      popular: 'Maarufu:',
      sugMichelin: 'Vyakula vya Michelin',
      sugMassage: 'Masaji ya Balinese',
      sugMaybach: 'Dereva wa Maybach',
      sugCaviar: 'Caviar & Divai Nzuri',
      sugYacht: 'Kukodi Boti ya Kifahari',
      btnFineDining: 'Vyakula Bora',
      btnSpa: 'Spa & Afya',
      btnMobility: 'Usafiri wa VIP',
      ambienceDaylight: 'Mwonekano wa Mchana',
      ambienceTwilight: 'Mwonekano wa Jioni',
    },
    categories: {
      heading: 'Vitengo vya Huduma za App',
      subtitle: 'Bofya kategoria yoyote hapa chini kuona vyakula vya chumbani, huduma za spa, usafiri na bidhaa maalum.',
      groceriesTitle: 'Vyakula & Vinywaji',
      groceriesDesc: 'Mvinyo bora, caviar & chakula safi cha villa',
      transportTitle: 'Usafiri wa VIP',
      transportDesc: 'Maybach ya Uwanja wa Ndege, Rolls-Royce & Helikopta',
      spaTitle: 'Spa & Afya',
      spaDesc: 'Masaji ya Balinese ndani ya villa, usoni & utulivu',
      restaurantsTitle: 'Migahawa Bora',
      restaurantsDesc: 'Huduma ya chumbani ya vyakula vya hadhi ya juu',
      experiencesTitle: 'Matukio ya Kipekee',
      experiencesDesc: 'Safari za boti, ziara za helikopta & mchezo wa polo',
      essentialsTitle: 'Mahitaji Muhimu',
      essentialsDesc: 'Huduma binafsi, afya & vinywaji vya kuburudisha',
      viewAll: 'Tazama Kategoria Zote',
    },
    howItWorks: {
      badge: 'Soko la huduma la NEXG',
      heading: 'NEXG inaunganisha huduma za Nairobi',
      subtitle: 'Gundua huduma, chagua unachohitaji, kisha agiza, weka nafasi au tuma ombi—hatua tatu rahisi.',
      step1Title: 'Skani au Fungua',
      step1Desc: 'Skani msimbo wa QR ndani ya chumba au fungua wavuti yetu moja kwa moja kwenye kifaa chochote bila kupakua programu.',
      step2Title: 'Gundua aina 21 za huduma',
      step2Desc: 'Pata mikahawa, bidhaa za dukani, famasia, afya, usafiri, matukio ya karibu na huduma nyingine katika soko moja.',
      step3Title: 'Agiza, weka nafasi au omba huduma',
      step3Desc: 'Chagua hatua inayopatikana: agiza bidhaa, weka nafasi ya huduma, omba huduma au uliza bei.',
    },
    promo: {
      badge: 'Upendeleo Maalum wa Wageni',
      heading: 'Uwasilishaji wa Bure Kwenye Agizo la Kwanza',
      desc: 'Furahia bila tozo ya uwasilishaji kwenye migahawa yote washirika na mikusanyiko ya divai kwa kutumia nambari ya chumba chako.',
      cta: 'Gundua Vyakula Sasa',
      code: 'Tumia msimbo: VILLA2026',
      appHeading1: 'Nenda na NEXG',
      appHeading2: 'kila mahali',
      appSubtitle: 'Programu ya kila kitu kwa wageni, wakazi na wasafiri.',
      downloadOn: 'Pakua kwenye',
      appStore: 'App Store',
      getItOn: 'IPATE KWENYE',
      googlePlay: 'Google Play',
      merchantsTitle: 'Kwa Wafanyabiashara',
      merchantsDesc: 'Kuza biashara yako ukitumia NEXG.',
      merchantsCta: 'Shirikiana nasi',
      couriersTitle: 'Kwa Madereva',
      couriersDesc: 'Leta ubora. Jiunge na kundi letu.',
      couriersCta: 'Omba sasa',
      propertiesTitle: 'Kwa Hoteli & Majengo',
      propertiesDesc: 'Boresha uzoefu wa wageni wako.',
      propertiesCta: 'Jiunge nasi',
    },
    features: {
      badge: 'Ubora & Uaminifu',
      heading: 'Kiwango cha Ukarimu wa Kifahari',
      subtitle: 'Kwanini hoteli za hadhi ya juu, makazi binafsi na wageni mashuhuri wanaiamini NEXG.',
      feat1Title: 'App wa Saa 24/7',
      feat1Desc: 'Msaada wa lugha mbalimbali kwa maombi maalum ya chakula, uhifadhi na uwasilishaji wa wakati maalum.',
      feat2Title: 'Wapishi & Washirika wa Hali ya Juu',
      feat2Desc: 'Ushirikiano wa moja kwa moja na migahawa mashuhuri na wataalamu walioidhinishwa wa masaji.',
      feat3Title: 'Faragha & Usalama Kamili',
      feat3Desc: 'Malipo yaliyolindwa kupitia chumba, uwasilishaji usio na mguso, na usiri kamili wa mgeni.',
      feat4Title: 'Usafirishaji wa Haraka wenye Halijoto Maalum',
      feat4Desc: 'Vifaa maalum vya kuhifadhi joto na magari safi ya kifahari kuhakikisha chakula kinawasili kikiwa tayari kuliwa.',
      f1Title: 'Malipo salama',
      f1Desc: 'Salama & yaliyolindwa',
      f2Title: 'Ufuatiliaji wa papo hapo',
      f2Desc: 'Jua mahali kilipo',
      f3Title: 'Chaguzi nyingi za malipo',
      f3Desc: 'Kadi, M-Pesa & zaidi',
      f4Title: 'Uwasilishaji wa siri',
      f4Desc: 'Faragha imehakikishwa',
    },
    restaurants: {
      title: 'Vyakula Bora & Huduma ya Chumbani',
      subtitle: 'Menyu maalum kutoka kwa wapishi mashuhuri zinazoletwa zikiwa moto moja kwa moja mezani kwako.',
      searchPlaceholder: 'Tafuta migahawa, sushi, nyama ya wagyu, pasta...',
      filterAll: 'Vyakula Vyote',
      filterJapanese: 'Kijapani / Omakase',
      filterItalian: 'Kiitaliano / Pasta',
      filterFrench: 'Kifaransa cha Kifahari',
      filterMediterranean: 'Bahari ya Mediterania',
      filterSteakhouse: 'Nyama ya Kuchoma',
      filterDesserts: 'Keki & Vitafunio',
      viewMenu: 'Tazama Menyu',
      minOrder: 'Kima cha Chini',
      deliveryTime: 'Muda wa Kufika',
      featuredDish: 'Chakula Maalum',
      addToBag: 'Weka Kwenye Mfuko',
      closed: 'Imefungwa kwa Maandalizi',
      openNow: 'Inapokea Maagizo',
    },
    spa: {
      title: 'Spa & Afya ya Utulivu',
      subtitle: 'Geuza villa yako kuwa kituo cha faragha cha mapumziko na wataalamu bora wa masaji na urembo.',
      bookTreatment: 'Weka Miadi ya Tiba',
      duration: 'Muda',
      inVilla: 'Ndani ya Villa / Chumba',
      sanctuary: 'Banda Maalum la Resort',
      therapistGender: 'Uchaguzi wa Mtaalamu',
      anyTherapist: 'Bila Upendeleo',
      femaleTherapist: 'Mtaalamu wa Kike',
      maleTherapist: 'Mtaalamu wa Kiume',
      reserveNow: 'Thibitisha Miadi',
    },
    transport: {
      title: 'Usafiri wa VIP & Madereva Binafsi',
      subtitle: 'Magari ya Maybach, SUV za Range Rover VIP, na huduma za helikopta zinazopatikana mara moja.',
      chauffeurIncluded: 'Dereva wa Hadhi ya Juu Amejumuishwa',
      perHour: '/ saa',
      airportTransfer: 'Usafiri wa VIP wa Uwanja wa Ndege',
      bookChauffeur: 'Agiza Gari',
      capacity: 'Viti',
      luggage: 'Uwezo wa Mizigo',
      instantDispatch: 'Kutuma Gari Mara Moja',
    },
    groceries: {
      title: 'Mkusanyiko wa Vinywaji & Vyakula vya Villa',
      subtitle: 'Champagne za kifahari, caviar ya Beluga, vitafunio vya kipekee, na vyakula freshi vya asubuhi.',
      cellar: 'Hifadhi ya Divai Nzuri',
      pantry: 'Vyakula vya Kifahari',
      caviar: 'Caviar & Ladha Adimu',
      bakery: 'Mkate Freshi wa Asubuhi',
      addToCart: 'Weka Kwenye Agizo',
      inStock: 'Tayari kwa Uwasilishaji',
    },
    experiences: {
      title: 'Matukio Maalum ya Kifahari',
      subtitle: 'Safari zisizosahaulika za boti za kifahari, ziara za helikopta angani, kambi jangwani na mafunzo ya polo.',
      bookExperience: 'Uliza & Weka Nafasi',
      groupSize: 'Uwezo wa Watu',
      duration: 'Muda wa Tukio',
      vipHostIncluded: 'Mwezeshaji Maalum wa App',
    },
    cart: {
      title: 'Kikapu Chako cha App',
      emptyTitle: 'Kikapu Chako Kiko Wazi',
      emptyDesc: 'Chagua vyakula bora, huduma za spa, vinywaji adimu, au usafiri wa kifahari ili kuanza agizo lako.',
      exploreBtn: 'Gundua Vyakula & Huduma',
      subtotal: 'Jumla Ndogo ya Bidhaa',
      deliveryFee: 'Ada ya Uwasilishaji wa Kifahari',
      conciergeService: 'Ada ya Huduma ya App (5%)',
      total: 'Kiasi Kamili',
      checkoutBtn: 'Endelea na Idhini ya Chumba',
      villaPlaceholder: 'Nambari ya Villa / Chumba / Penthouse',
      specialNotes: 'Maelekezo maalum kwa mpishi au muda wa kufikisha...',
      orderPlaced: 'Agizo Limewekwa Kikamilifu!',
      items: 'vitu',
      clearCart: 'Futa Kikapu',
    },
    tracking: {
      title: 'Ufuatiliaji wa Moja kwa Moja',
      orderNumber: 'Nambari ya Agizo',
      estimatedArrival: 'Muda wa Kukadiriwa Kufika',
      mins: 'dakika',
      statusConfirmed: 'Agizo Limethibitishwa na App',
      statusPreparing: 'Maandalizi ya Jikoni / Mfanyabiashara',
      statusInTransit: 'Dereva Maalum Yuko Njiani',
      statusDelivered: 'Limefikishwa Kwenye Villa',
      courierAssigned: 'Dereva Aliyepangiwa',
      contactConcierge: 'Wasiliana na Dawati la App',
      close: 'Funga Kifuatiliaji',
    },
    footer: {
      brandDesc: 'Jukwaa kuu la ukarimu wa kifahari kwa wageni wa hoteli za nyota tano. Inaunganisha hoteli za hadhi ya juu, villa za kibinafsi, na wasafiri mashuhuri na wapishi bora, wataalamu wa afya na usafiri wa kifahari.',
      exploreTitle: 'Huduma za App',
      partnersTitle: 'Biashara & Washirika',
      legalTitle: 'Sheria & Ulinzi',
      privacy: 'Sera ya Faragha',
      terms: 'Vigezo vya Huduma',
      cookies: 'Mipangilio ya Vidakuzi',
      rightsReserved: 'Haki Zote Zimehifadhiwa. NEXG App International.',
      language: 'Lugha / Eneo',
      craftedWith: 'Imeundwa kwa ajili ya ukarimu wa hadhi ya nyota tano',
      aboutText: 'Ukarimu Uliorahisishwa. Kuboresha uzoefu wa uwasilishaji wa kipekee na concierge binafsi kote Kenya.',
      verticals: 'Huduma Zetu',
      fineDining: 'Vyakula Bora',
      spaWellness: 'Spa & Afya',
      vipMobility: 'Usafiri wa VIP',
      gourmetCellar: 'Vinywaji Bora',
      experiences: 'Matukio Maalum',
      partners: 'Washirika',
      forMerchants: 'Kwa Wafanyabiashara',
      forCouriers: 'Kwa Madereva',
      forProperties: 'Kwa Majengo & Hoteli',
      legalSupport: 'Sheria & Msaada',
      conciergeDesk: 'Dawati la App',
      termsOfService: 'Masharti ya Huduma',
      privacyPolicy: 'Sera ya Faragha',
      safetyStandards: 'Viwango vya Usalama',
      connect: 'Wasiliana Nasi',
      rights: '© 2026 NEXG App. Haki zote zimehifadhiwa.',
      simulatedNotice: 'Onyesho la Mfumo wa Malipo (Inasubiri Muunganisho wa Moja kwa Moja)',
    },
    partnerHeaders: {
      ecosystem: 'Mfumo Wetu',
      qrTech: 'Teknolojia ya QR',
      revShareCalc: 'Kikokotoo cha Mapato',
      integrations: 'Muunganisho',
      benefits: 'Faida',
      logistics: 'Usafirishaji',
      howItWorks: 'Jinsi Inavyofanya Kazi',
      categories: 'Makundi',
      earningsCalc: 'Kikokotoo cha Mapato',
      fleetPerks: 'Faida za Dereva',
      standards: 'Viwango vya Huduma',
      faq: 'Maswali ya Fleet',
    },
    partnersPortal: {
      merchantTitle: 'Washirika wa Biashara',
      merchantSubtitle: 'Panua biashara yako ya vyakula na ukarimu katika villa za nyota tano na vyumba vya kifahari.',
      courierTitle: 'Madereva wa Fleet',
      courierSubtitle: 'Wasilisha maagizo ya kifahari ya concierge. Pata malipo bora na zawadi za vidokezo.',
      propertiesTitle: 'Kwa Hoteli & Majengo',
      propertiesSubtitle: 'Jukwaa la ukarimu wa chumbani bila gharama za mtaji lenye mgawanyo wa moja kwa moja wa mapato.',
      backHome: 'Rudi Kwenye App',
      listBusiness: 'Sajili Biashara Yako',
      applyFleet: 'Omba Kujiunga na Fleet',
      partnerNexg: 'Shirikiana na NEXG',
      onboardingActive: 'Inaendelea',
      onboardingStatus: 'Hali ya Usajili',
      stepText: 'Hatua',
      ofText: 'kati ya',
      nextStep: 'Hatua Inayofuata',
      prevStep: 'Iliyotangulia',
      submitApplication: 'Tuma Maombi',
      agreementTitle: 'Mkataba wa Huduma za Ushirika',
      agreementDesc: 'Tafadhali pitia masharti na uweke saini ya kidijitali hapa chini.',
      successTitle: 'Maombi Yametumwa Kikamilifu!',
      successDesc: 'Kamati yetu ya usajili wa washirika itapitia maombi yako na kuwasiliana nawe ndani ya saa 24.',
      returnHome: 'Rudi Kwenye Mwanzo wa Tovuti',
      downloadSummary: 'Pakua Muhtasari wa PDF',
      riderPortal: 'Tovuti ya Madereva',
      eastAfricaSecure: 'Afrika Mashariki • Usajili Salama',
      backToSite: 'Rudi Kwenye Tovuti',
      activeStatus: 'Inaendelea',
    },
  },
  ar: {
  ui: {
    bookingCalendar: {
      's_07499a': 'Party / Guests',
      's_10422c': 'Local Villa Time',
      's_183a37': 'Sync Calendar',
      's_534c34': 'Next Month',
      's_71b856': 'Previous Month',
      's_79caea': 'Available Time Slots',
      's_8efff8': 'In 2 Days',
      's_aeb91b': 'Dedicated Reservation Calendar',
      's_e5366b': 'Selected Schedule',
      's_fdc2b8': 'Next Week',
    },
    cartDrawer: {
      's_11a9f0': 'Explore Menus',
      's_1fc724': 'Promo code (try NEXG20)',
      's_2303a3': 'Your cart is empty',
      's_237e47': 'Clear entire cart',
      's_2c7952': 'Simulated checkout & instant confirmation',
      's_42cb61': 'Close cart',
      's_44951e': 'Courier tip',
      's_643b96': 'Your Order Cart',
      's_733b61': 'Delivery fee',
      's_76ecba': 'Remove item',
      's_ab8546': 'Explore our curated restaurants and add artisanal dishes or concierge dining to get started.',
      's_c7085d': 'Courier Concierge Tip',
      's_d2467b': 'Your order',
      's_d2f4d4': 'Proceed to Checkout',
      's_d6ea26': 'Concierge service fee',
    },
    categories: {
      's_1a9863': 'Browse Partners',
    },
    categoryExplorerModal: {
      's_233e38': 'Click any category or subcategory to instantly browse partners',
      's_7c267a': 'View listings',
      's_7fd08b': 'Reset Catalog Filters',
      's_940323': 'Close categories',
      's_af1c10': 'Verified Merchant Partners',
      's_c7fa37': 'Try searching for another keyword or clear the search query.',
      's_c9f43c': 'Search across all 21 categories & 134 subcategories (e.g. Fine Dining, Vapes, Chauffeur, Safari)...',
      's_e37ac9': 'No matching verticals found',
      's_f4cf7c': 'Merchant Categories & Subcategories',
    },
    categoryPage: {
      's_004d7e': 'Top Rated',
      's_062888': 'Free Delivery',
      's_2cef94': 'Reset all filters',
      's_41eb8f': 'Fastest Delivery',
      's_c4baea': 'Price Level',
      's_fce284': 'No merchants found matching your filters.',
    },
    checkoutSimulatedModal: {
      's_119c2f': 'This payment is',
      's_19e2a2': 'Finalize & Place Order',
      's_3a7a99': 'Apple Pay',
      's_55e54d': 'App Delivery Instructions',
      's_635949': 'Choose Simulated Payment Method',
      's_63da07': 'Simulate Payment & Place Order',
      's_6aa79c': 'Selected Items',
      's_7db213': 'Hotel / Villa / Street Address',
      's_846466': 'Close checkout',
      's_882f46': 'Simulates instant STK push prompt directly on mobile handset.',
      's_9ad55a': 'Total Demo Amount',
      's_ac51d0': 'Cardholder Name',
      's_b79126': 'No real funds or accounts will be debited.',
      's_bac774': 'Simulated Demo Checkout',
      's_bb36a9': 'DEMO ROUTER',
      's_cecb67': 'Preloaded Demo Card',
      's_dd0a60': 'Router Demo Validated',
      's_e5297b': 'Delivery Address & Location',
      's_e569ab': 'Processing Demo Payment...',
      's_ea3289': 'Room Folio / Cash',
      's_ea4478': 'Simulates one-touch FaceID / TouchID authorization.',
      's_eb034a': 'Billed directly to your hotel master room folio upon delivery.',
      's_ee343f': 'Sandbox Router Active',
      's_fee23b': 'Merchant Partner',
    },
    consentBanner: {
      's_35c291': 'رفض الكل',
      's_66cd82': 'ملفات تعريف الارتباط الضرورية للغاية تحافظ على عمل الموقع. تبقى ملفات التحليلات والتسويق معطلة حتى تقوم بتشغيلها، ويمكنك تغيير ذلك في أي وقت.',
      's_788df5': 'خيارات ملفات تعريف الارتباط',
      's_821d1f': 'قبول الكل',
      's_956fa7': 'حفظ الخيارات',
      's_9e0cba': 'إعدادات ملفات تعريف الارتباط',
      's_da6a92': 'ملفات تعريف الارتباط الضرورية نشطة دائماً. وكل ما عداها اختياري.',
      's_e7d306': 'تفضيلات ملفات تعريف الارتباط',
      's_f477c8': 'نشط دائماً. لا يمكن إيقافه لأن الموقع لا يعمل بدونه.',
    },
    courierOnboarding: {
      's_037e0b': 'Our compliance officers verify your submitted National ID, license, PIN, and fleet logbooks directly against NTSA registers.',
      's_03c52e': 'Guaranteed Base Salary',
      's_06c8b6': 'Verify your registered logistics enterprise. Only PDF files and scanned images up to 5MB size are accepted.',
      's_0b39f6': 'Fleet Partner',
      's_0bd62e': 'Account Number',
      's_0cb44f': 'Executive Sedan / Van',
      's_0d36d5': 'Active public third-party or comprehensive fleet cover policy certificate.',
      's_0d98d0': 'E.g. Swift Deliveries',
      's_0e3256': 'Submit official identification and transit licensing details.',
      's_0f32ec': 'Rider Record Card',
      's_1081b3': 'Full Name, Phone, ID Number, License Number, Vehicle Type, Plate Number',
      's_10f420': 'Shift & Operating Zones',
      's_14bf35': 'Ride custom NEXG-branded premium logistics vehicles, operate consistent shifts, and enjoy a stable guaranteed base salary.',
      's_156177': 'Certificate of Incorporation',
      's_17b238': 'Accepted For Fleet Provider',
      's_1805c7': 'This agreement begins immediately on approval and is valid for a period of 12 months. Either party may terminate with 7 days\' written notice, or NEXG may block platform access instantly in cases of safety breach, driving license revocation, or fraudulent behavior.',
      's_197646': 'Full Legal Name',
      's_204be3': 'E.g. operations@swiftlogistics.co.ke',
      's_2358e6': 'Independent Rider',
      's_24813d': 'E.g. Kileleshwa, Block D',
      's_26712f': 'Authorized Primary Contact Person',
      's_27538f': 'Outline your company’s transit capacities and target operating logistics zones.',
      's_27980f': 'WhatsApp Mobile Number',
      's_27c646': 'Company Office Headquarters',
      's_2952ca': 'Type Signature',
      's_2b31a3': 'E.g. A001234567Z',
      's_2cb0d8': 'Accepted & Agreed by Rider',
      's_2d6ca0': 'Vehicle Type',
      's_2dc8f1': 'E.g. Corner House, 4th Floor, Kimathi St.',
      's_2ed783': 'Return to Elite Fleet page',
      's_30b928': 'Company KRA PIN Certificate',
      's_310c80': 'Back to Couriers',
      's_312631': 'Bank Name',
      's_3174a5': 'Contact Email Address',
      's_31843b': 'Clear canvas',
      's_338cf2': 'Services & Settlement Payout',
      's_340115': 'Clear scanned copy of front and back face of your card.',
      's_34e784': 'E.g. Swift Express Logistics Ltd',
      's_34f9ae': 'Certificate of Incorporation / Reg No.',
      's_377b90': 'Authorized Dispatch Committee',
      's_37dfba': 'NTSA Driver\'s License Number',
      's_3873df': 'E.g. DL-XXXXXX',
      's_3af714': 'No active couriers added yet',
      's_3ba957': 'E.g. Nairobi',
      's_3bfd88': 'KRA PIN Number',
      's_3c3541': 'Consolidated Business payout',
      's_3c774b': 'Carry VIP guests to properties',
      's_3cc4fd': 'NEXG Provides Vehicle',
      's_3ce5aa': 'Emergency Contact Person',
      's_41d914': 'Choose the expiry date',
      's_41fe24': 'Draw digital signature with finger or pointer',
      's_430404': 'Remove Card',
      's_44fe57': 'Emergency Mobile Phone',
      's_464dfd': 'We declare absolute compliance with Kenyan corporate regulations, active tax filings, and legal road safety acts.',
      's_4979be': 'We certify that all couriers listed in our squad profiles hold valid, unexpired NTSA driving licenses and clean background clearance certifications.',
      's_4c7486': 'Corporate Job Title',
      's_4c987a': 'Authorized Officer Full Name',
      's_4d1c2f': 'Structured Shift schedules',
      's_4ff862': 'E.g. 4',
      's_50d865': 'Upload crisp clear photo snapshots or PDF files under 5MB size limit.',
      's_5104d5': 'Preferred Operating Area Zone',
      's_51dacf': 'WhatsApp Number',
      's_53d718': 'The Fleet Provider represents and warrants that all couriers and motorbikes comply with roadworthy rules, hold comprehensive insurance certifications, and observe Kenya\'s Data Protection Act 2019 standards.',
      's_55537f': 'Vehicle Registration details',
      's_574f02': 'Next Step',
      's_587649': 'Official KRA Pin certification document page from iTax portal.',
      's_5920ae': 'You are applying for a scheduled, salaried position. NEXG provides custom branded bikes, gear, and fuel budgets. Below, you will also designate your operational preferences.',
      's_5a833b': 'Residential Address',
      's_5b5250': 'Fleet Partner Business Profile',
      's_5cfa43': 'NTSA Driving License',
      's_5f5518': 'Drive your own motorcycle or scooter, set your flexible calendar hours, and take commissions per successfully completed errand.',
      's_63a113': 'Total Registered Vehicles',
      's_64346b': 'Full Name',
      's_6790f2': 'Corporate Bank Name',
      's_692fe8': 'E.g. P051234567Z',
      's_6b3d6a': 'Deliver premium retail items',
      's_6f9c91': 'E.g. +254 711...',
      's_70abeb': 'Bank Settlement Transfer',
      's_714406': 'Configure your legal registered business details for logistics partnerships.',
      's_717eb1': 'Company Account Title',
      's_71c904': 'NEXG APP LIMITED',
      's_71ebbb': 'E.g. Red Honda CB125F (Year 2023)',
      's_71f6e3': 'Register Active Couriers Squad',
      's_72a587': 'Board Operations Committee',
      's_74955f': 'E.g. Westlands',
      's_76af1d': 'E.g. 15',
      's_77522e': 'NEXT STEPS IN OUR VERIFICATION TIMELINE',
      's_79865b': 'Preferred Working Shift',
      's_7cf2e1': 'Alternative Contact Phone',
      's_7d5f6e': 'Unlock premier delivery earnings, tailored branding, and unmatched support in Kenya’s luxury hospitality ecosystem.',
      's_7d8667': 'Plate Number',
      's_81db77': 'Years in Logistics Sector',
      's_827c49': 'Account Holder Legal Name',
      's_828ade': 'Vip App',
      's_831dc7': 'KRA PIN Confirmation Certificate',
      's_86d4ca': 'For NEXG App',
      's_8bb6da': 'E.g. 12345678',
      's_8d5d4c': 'Company Business Verification Documents',
      's_8e203d': 'Handle high-end guest requests',
      's_8f912f': 'E.g. CPR/2018/12345',
      's_903d8d': 'Execute Partnership Agreement Contract',
      's_913798': 'Click Add Rider Card above or upload your riders spreadsheet via CSV bulk import.',
      's_93457d': 'Fleet Operational Scale & Coverage',
      's_93e220': 'Corporate Fleet Partner logistics Framework',
      's_9691d0': 'ONBOARDING PROFILE SUMMARY',
      's_984805': 'Operating Counties & Estates Coverage',
      's_99dc14': 'Pending Compliance Review',
      's_9d159c': 'Direct Mobile Number',
      's_a0094a': 'Payout Method',
      's_a1524d': 'E.g. 12001234567',
      's_a1c4fe': 'E.g. +254 700 111 222',
      's_a221a1': 'Upon document clearance, you\'ll receive a WhatsApp invitation to join our premium standard customer service and hospitality training.',
      's_a40d60': 'Premium Commission Payout',
      's_a620a5': 'Official business registration certificate page issued by the Registrar of Companies.',
      's_a7c94e': 'NEXG agrees to compile and settle client order payments to the Fleet Provider’s registered bank account weekly on Mondays, less a platform operations commission fee of',
      's_a85feb': 'Your premium motorbike is provided by NEXG. You do not need to register a personal motorbike logbook or license plate here.',
      's_a8caa4': 'Add individual active riders to your partnership ledger.',
      's_aafa84': 'Active Vehicle types represented in Fleet',
      's_ac26fd': 'Submit Portfolio Agreement',
      's_ad7df6': 'Motorcycle / Scooter',
      's_aed4fc': 'Join the Elite NEXG Rider Fleet',
      's_aef6a9': 'National ID / Passport Number',
      's_af7bb7': 'Signatory Director\'s National ID',
      's_af8a4e': 'The Fleet Provider certifies that they actively manage and pay a squad of',
      's_b026ba': 'City HQ Location',
      's_b09e88': 'Draw Signature',
      's_b21f30': 'ID Number',
      's_b2e0a8': 'Driver\'s License Expiry Date *',
      's_b5015c': 'List all cities and estates where your fleet currently has active coverage. E.g. Nairobi CBD, Westlands, Kilimani, Mombasa, Diani, etc.',
      's_b5c479': 'NEXG Dedicated Rider',
      's_b724e7': 'Print Agreement Document',
      's_b984fa': 'Import CSV Spreadsheet',
      's_b9d00c': 'This contract is binding for a term of 12 months. Either partner may exit the frame by providing 14 days\' written notice to the other party.',
      's_bc5303': 'Add Rider Card',
      's_bf24cb': 'Name exactly as printed on legal ID card',
      's_c1ecb3': 'Package Delivery',
      's_c33c9b': 'DL Number',
      's_c59900': 'E.g. KMCA 123A',
      's_c7a051': 'We declare that our organization maintains comprehensive third-party logistics insurance and active public liability coverage across all active fleet operators.',
      's_c85d99': 'Proof of ownership and active public transit insurance coverage.',
      's_c8708a': 'Company Legal Name',
      's_c8bc71': 'Corporate Bank Settlement Account',
      's_c8ed49': 'Identification & Vehicle Setup',
      's_ca5690': 'Download Standard CSV Template',
      's_cabacd': 'NEXG Operations Admin',
      's_cdec1f': 'Both sides of your active, unexpired logistics driver license.',
      's_d101b7': 'Onboard your registered Kenyan logistics agency and entire courier squad. Bulk upload riders and manage team-level settlements.',
      's_d5184b': 'Own Vehicle required',
      's_d5e54c': 'Commercial Fleet Insurance Policy',
      's_d64903': 'NEXG remits compiled client transport payout settlements directly to your corporate account weekly on Mondays.',
      's_d66864': 'Flexible Shifts',
      's_d9863a': 'E.g. Fleet Manager',
      's_db3b79': 'Account Name',
      's_dca3fc': 'E.g. Westlands, Kilimani, Lavington',
      's_ddb4d1': 'E.g. Equity Bank',
      's_de744b': 'E.g. Mary Jane',
      's_e04a0d': 'Payout Settlement Configurations',
      's_e07446': 'Review pre-filled contract agreement clauses and apply your electronic signature.',
      's_e0934e': 'Date of Birth *',
      's_e12ee9': 'Preferred Transit Vehicle Assigned',
      's_e15c6c': 'Trading Name / Brand Name',
      's_e16a80': 'Document Verification Uploads',
      's_e1c6ae': 'Bulk CSV Squad Import',
      's_e1fe05': 'E.g. Albert Mwangi',
      's_e21ec5': 'Vehicle Model & Color',
      's_e387b2': 'Business KRA PIN',
      's_e3ca9b': 'E.g. John Kamau Maina',
      's_e4c574': 'E.g. +254 711 000 000',
      's_e7710e': 'Typed Electronic Signature preview',
      's_e7cfff': 'Authorized Signature Panel',
      's_e90701': 'Select Gender',
      's_eb6915': 'Fleet Integrity Declarations',
      's_ec9a3f': 'Estate Area / Street',
      's_ecd675': 'Vehicle Logbook & Third-Party Insurance',
      's_eeec98': 'Import CSV',
      's_ef8482': 'Choose Your Partnership model',
      's_efbb4c': 'E.g. Spouse / Parent',
      's_f3a211': 'E.g. +254 700 987 654',
      's_f4afb4': 'Choose your date of birth',
      's_f65568': 'E.g. +254 712 345 678',
      's_f6da6f': 'Personal Profile Details',
      's_f71ebc': 'E.g. John Kamau',
      's_f954ab': 'NEXG Fleet Operations',
      's_f9f8d5': 'Select the model that aligns with your assets. We have personalized contracts and onboarding checklist steps for each path.',
      's_fa0cdb': 'Total Active Riders',
      's_fbbe43': 'Configure how you receive settlements and who to contact in emergencies.',
      's_fca1ec': 'Ensure your details correspond exactly with your National Identification Document.',
      's_feb1b4': 'ID of the legal officer executing the Fleet Partnership Agreement.',
      's_febf86': 'Rider agrees to strictly wear the customized NEXG apparel on duty, maintain exemplary clean vehicle hygiene, arrive within specified time slots, and respect international hospitality guests\' absolute privacy. Failure to maintain a minimum 4.0/5.0 star rating may result in temporary profile deactivation.',
    },
    curatedNairobiWorlds: {
      's_15a714': 'Dynamic cross-category plans tailored to your moment, occasion & time of day',
      's_18a51d': 'Full Experience Builder',
      's_41dd82': 'Curated Nairobi Worlds',
      's_52c035': 'NEXG Experience Orchestrator',
      's_8abe87': 'Explore Offerings in Main Feed',
      's_c2018d': 'Contextual Experience Hub',
      's_ecc198': 'Click step to explore offerings',
      's_fe8da0': 'Nairobi Curated',
    },
    databaseSqlModal: {
      's_baaf3a': 'PostgreSQL Database Scripts',
    },
    dateTimeField: {
      's_46a299': 'Previous month',
      's_7ecc8b': 'Choose a year',
      's_8abf7c': 'Next month',
    },
    discoveryScreen: {
      's_030851': 'Merchant categories',
      's_0b7ee2': 'All verticals',
      's_176135': 'The API may not be running. Start it with',
      's_412226': 'Clear filters',
      's_67300d': 'Clear search',
      's_8344a6': 'Search merchants',
      's_a3c57f': 'No merchants found',
      's_dfe60c': 'Load more',
      's_f4d948': 'Search restaurants, spa, safaris, champagne, chauffeur, pharmacy...',
    },
    dishCustomizerModal: {
      's_052b34': 'Guest Satisfaction',
      's_062e79': 'Increase quantity',
      's_1c711d': 'Verified Diners Only',
      's_2db328': 'Any preferences? e.g. Extra dressing on side, cutlery needed...',
      's_492026': 'Add to Order',
      's_594a3d': 'Share what made this dish memorable...',
      's_6c02ab': 'Decrease quantity',
      's_70d3a5': 'Close modal',
      's_84ab4b': 'Submit Verified Review',
      's_9c0406': 'Suite / Villa (e.g. Penthouse 402)',
      's_a196bb': 'Customize & Options',
      's_bfae0e': 'Your Name (e.g. Eleanor V.)',
      's_d0fac0': 'Leave Your Dining Review',
      's_ece1f0': 'Special Kitchen Instructions',
    },
    dockedSearchBar: {
      's_67300d': 'Clear search',
    },
    experiences: {
      's_057742': 'Curated Experience Hosts & Outfitters',
      's_14c995': 'Book Date',
      's_574a76': 'Book Activity',
      's_63ae7c': 'Date & Time',
      's_6568e5': 'Your booking with',
      's_96ebfb': 'Search hosts, Maasai Mara, Giraffe Centre, cinema, safari...',
      's_9fda6b': 'Back to all Outfitters',
      's_a1e9f9': 'Explore Home',
      's_ad3a34': 'Private Safaris, Aerial Tours & Cultural Ateliers',
      's_cebc44': 'Choose an expert outfitter to browse hot-air balloon flights over the Mara, private giraffe conservation sanctuaries, and master artisan ateliers.',
      's_d29299': 'Bespoke Concierge Expeditions',
      's_eb9e1e': 'Confirm Booking',
      's_f6e8ce': 'Experience Reservation',
    },
    floatingCartBar: {
      's_f40d71': 'View Order',
    },
    forCouriers: {
      's_06816c': 'Apply to Drive',
      's_08c1c3': 'We provide access to high-quality vehicle maintenance programs, comprehensive courier insurance plans, and dedicated dispatch teams assisting you 24/7.',
      's_0c343a': 'Apply Online',
      's_0c8a9a': 'Terms of Service',
      's_0e840b': 'Pocket High Tips',
      's_110158': 'Help Center',
      's_153ab5': 'Idle Reduction',
      's_18414d': 'Elite Fleet',
      's_1bedd8': 'Ambassadors utilizing our suite-specific integrated routing enjoy significantly higher success ratings and earn double the average industry tips.',
      's_1d2be9': 'Safety Guidelines',
      's_209f63': 'Average Earnings Growth',
      's_22d1d3': 'Once you submit your application online, our onboarding team reviews documents within 48 hours. If qualified, you\'ll be invited for a brief physical assessment and standard white-glove training before your account goes active.',
      's_2a7274': 'Submit your vehicle registration and documents online in under 5 minutes through our secure, mobile-friendly onboarding portal.',
      's_2bf27f': 'STEP 01',
      's_2d816d': 'Career Advancement',
      's_2e6151': 'FLEET REQUIREMENTS',
      's_2ed1ed': 'Premium Payouts for Professional Ambassadors.',
      's_33b4c6': 'Join the Elite Fleet',
      's_3500ab': 'Join a community built on premium status and mutual respect. We support your career path and help you develop unmatched service skills.',
      's_355ac2': 'Deliveries per Day',
      's_38769a': 'For Properties',
      's_38df83': 'Estimate Earnings',
      's_39bc68': 'Your Vehicle Type',
      's_41493f': 'Join the Elite',
      's_42475b': 'Maintain exceptional ratings and receive daily performance multipliers and exclusive priority dispatcher pairing.',
      's_440245': 'The NEXG Driver App',
      's_45b640': 'Go online in the driver app, navigate to hot premium spots, complete high-end orders, and watch your mobile wallet balance swell.',
      's_4748c1': 'Receive clear, automated settlements straight to your bank or mobile wallet without delay, backed by detailed electronic statements.',
      's_4c36e1': 'SETUP TIMELINE',
      's_4d5b64': 'Ambassador Rating',
      's_4d81b2': 'STEP 03',
      's_4f555f': 'Track your daily performance, optimize your delivery times, and master Swahili & English hospitality tips with our smart companion analytics dashboard.',
      's_5150fd': 'Priority Routing Tech',
      's_52a6f3': 'For Partners',
      's_530246': 'Guaranteed Weekly Payouts',
      's_53cdfb': 'DATA INTELLIGENCE',
      's_54c4b5': 'Exceptional Presentation',
      's_5b8964': 'Guest Rating Profiles',
      's_5ce9fd': 'Fast Verification',
      's_5e7925': 'Our professional partner compliance team validates your records and issues a secure orientation invitation within 48 hours.',
      's_653ccb': 'We currently support major high-end neighborhoods and coastal luxury zones across Nairobi, Mombasa, and Diani, expanding quickly to other East African metropolitan areas.',
      's_677710': 'Route Efficiency Score',
      's_6bde0a': 'Apply Online Now',
      's_6d1c48': 'Earn stars and secure exclusive bonuses. Build private, anonymous reviews that reinforce your stellar reputation with premium hotels.',
      's_75dde0': 'Return to Guest App',
      's_765f2b': 'TRANSPARENT EARNINGS',
      's_777b12': 'Ambassador delivering gourmet meals',
      's_78df83': 'Powerful Analytics for Elite Drivers',
      's_7e32e7': 'Quick online onboarding. Submit details, attend orientation, retrieve your custom elite starter kit, and take your first order in under 48 hours.',
      's_7f255f': 'Deliver high-end products and culinary creations with meticulous care. Be dressed in custom-designed NEXG apparel to reflect elite standards.',
      's_8049d9': 'Weekly Payout Settlements',
      's_85cf78': 'No waiting for week-ends. Complete premium tasks and trigger instant payouts directly into your mobile wallet.',
      's_89bdbf': 'Elevating premium hospitality across East Africa with integrated, contactless concierge ecosystems.',
      's_8b1193': 'Understand your daily yields. Monitor peak areas, identify high-tipping zones, and learn the best hours to go online.',
      's_928714': 'Collect Starter Kit',
      's_933192': 'What it Takes to Be a NEXG Ambassador.',
      's_93a5bc': 'Exec Car',
      's_93fef0': 'Empowered Scheduling',
      's_95e986': 'Take complete control over your working hours. Plan your deliveries around peak fine-dining periods to lock in dynamic high fares.',
      's_97b846': 'Gain exclusive professional training in hospitality service, client management, and path leadership with certificates of excellence.',
      's_981b01': 'Premium Fleet Support',
      's_9ad0cc': 'Contact Us',
      's_9b1690': 'Apply to Fleet',
      's_9d3f52': 'Our advanced routing algorithms guide you efficiently to high-value destinations, minimizing idle mileage and maximizing deliveries per hour.',
      's_9db108': 'Privacy Policy',
      's_a08321': 'Redefining Delivery.',
      's_a1e9f9': 'Explore Home',
      's_a7acb1': 'Work according to your personal schedule. Take shifts during peak fine-dining hours for maximized yield.',
      's_a9577d': 'Secure Site',
      's_ad6c0d': 'KNOWLEDGE BASE',
      's_aed5c5': 'Must possess a clean driving record, valid local driver\'s license for your specified vehicle, and active comprehensive third-party insurance coverage.',
      's_b53080': 'Courier Partner FAQs',
      's_b74c4e': 'Toggle Theme',
      's_bc89aa': 'Empowered Flexibility',
      's_befa37': 'Ambassador scanning the driver app',
      's_c10fec': 'Flawless Modern Vehicle',
      's_c18810': 'Valid Documents & Licenses',
      's_c24cae': 'STEP 02',
      's_c38c49': 'Elite Rank Status',
      's_c71f96': 'Weekly Target Reached',
      's_c88176': 'Access culinary deliveries, spa wellness packages, and executive courier jobs cleanly integrated under a single, highly intuitive screen.',
      's_c887b9': 'About Us',
      's_ce60db': 'Own Your Earnings.',
      's_ce7472': 'Back to Home',
      's_d44881': 'Couriers Hero Background',
      's_d781b4': 'Operational Mapping',
      's_df9144': 'ELITE STANDARDS',
      's_e10068': 'Based on an average base fee of',
      's_e18d8e': 'Courier Earnings Estimator',
      's_e3a7a2': 'Direct payments made straight to your account every single week, with zero hidden fees.',
      's_e3b925': 'STEP 04',
      's_e6e178': 'Cookie Policy',
      's_e72e94': 'Earnings Analytics',
      's_eb35f1': 'Start your application today. Complete the secure onboarding questions and step into a new tier of professional independence and respect.',
      's_ec3c35': 'Stay updated with premier hospitality tips and trends.',
      's_eeb176': 'To guarantee top status, NEXG provides all approved couriers with premium tailored jackets, clean polo shirts, and custom-insulated delivery bags. Black trousers and clean black shoes are required on duty.',
      's_f370c7': 'Our app guides you right up to the designated suite or property zone, avoiding lobby confusion and ensuring frictionless drop-offs.',
      's_f582d4': 'Our dispatch systems minimize your empty miles. Pre-book orders or follow integrated corridors to stack high-paying jobs in a row.',
      's_f6e64a': 'Average Tip per Delivery',
      's_fbe3b3': 'Premium Integrated Hub',
      's_fcf600': 'Retrieve your tailored NEXG jackets, insulated food packs, smartphone bracket, and secure driver login credentials.',
      's_ff2382': 'Couriers Hero Daylight Background',
    },
    forMerchants: {
      's_032a19': 'Our professional curation experts ingest your items, style gorgeous visuals, and optimize layouts for direct contactless guest displays.',
      's_0c343a': 'Apply Online',
      's_0eaa2f': 'Right Where They Are.',
      's_118503': 'Merchants Hero Daylight Background',
      's_1600e2': 'Apply to Join NEXG',
      's_18414d': 'Elite Fleet',
      's_2bf27f': 'STEP 01',
      's_2f5b37': 'Merchant Support',
      's_38769a': 'For Properties',
      's_3f3d89': 'Zero integration headache. Submit your menu or catalogue, let us digitise your portal, and receive curated local sales in 48 hours.',
      's_4d81b2': 'STEP 03',
      's_52a6f3': 'For Partners',
      's_540349': 'Automated Revenue',
      's_591721': 'Higher Avg. Order Value',
      's_673bf7': 'Get paid on time, every time. Once a guest completes checkout, automated, secure merchant payouts route instantly to your bank.',
      's_750959': 'Applications are reviewed by our curation team within 24 hours to ensure our high standards of quality and service are maintained across the platform.',
      's_771412': 'Why Merchants Choose NEXG',
      's_7cb113': 'Multiply Volume',
      's_80b451': 'Instant Split Payouts',
      's_81df05': 'Consistent Orders',
      's_85feef': 'Premium Exposure',
      's_891482': 'We handle everything from digital menu formatting to custom checkout links. Absolutely no technical setup required on your end.',
      's_89a9da': 'Submit your fine dining menus, luxury spa offerings, or rental catalogs through our seamless, intuitive 2-minute onboarding form.',
      's_916b2f': 'Digital Integration',
      's_a1e9f9': 'Explore Home',
      's_a2e8c7': 'Receive Suite Orders',
      's_a92592': 'ONBOARDING TIMELINE',
      's_aa32fa': 'Start Onboarding',
      's_abafb4': 'Prepare packages meticulously. Professional NEXG couriers gather the items, fulfill deliveries, and secure payouts automatically.',
      's_ae23a7': 'Keep orders running flawlessly. Our active support concierge monitors deliveries live and assists with special suite requests.',
      's_b74c4e': 'Toggle Theme',
      's_ba7223': 'Commission on Pickups',
      's_c0228a': 'Reach Customers.',
      's_c24cae': 'STEP 02',
      's_c75030': 'Merchants Hero Background',
      's_c89f38': 'Partner with NEXG App to serve guests directly inside premier luxury properties. We provide white-glove logistics, automated payouts, and seamless integration with your existing team.',
      's_ce7472': 'Back to Home',
      's_ce9fe6': 'Never worry about transport. Our highly vetted professional courier fleet collects your packages and delivers them with elite standards.',
      's_d6626f': 'Zero Friction Setup',
      's_da08fb': 'Seamless Payouts',
      's_def7cc': 'Dedicated Support',
      's_e3b925': 'STEP 04',
      's_e56df8': 'WHY PARTNER WITH US',
      's_e6a013': 'Merchant Terms',
      's_e9cbdf': 'Verified Properties',
      's_f6538e': 'Tap into high-net-worth guests, tourists, and business travelers ordering gourmet meals, personal amenities, or spa treatments.',
      's_f6e1bd': 'Gain exclusive positioning in elite hotel room directories, high-visibility bedside QR cards, and digital concierge web-apps.',
      's_faae3e': 'As guests scan room QR codes, orders stream directly to your merchant dashboard with real-time audio and visual system notifications.',
      's_fe1a29': 'Contact Support',
    },
    forProperties: {
      's_0293af': 'Properties Hero Background',
      's_052b34': 'Guest Satisfaction',
      's_061f53': 'Curated local menus',
      's_06fb24': 'Integrate seamless, world-class concierge services into your luxury rentals and hotels. Empower guests to order gourmet food, book organic spa treatments, and request private transport with a single, contactless scan.',
      's_0a3693': 'Instant access, absolutely zero apps required',
      's_0c8a9a': 'Terms of Service',
      's_0d3b7b': 'Predict high-demand hours to allocate room cleaning, butler services, or external partner delivery drivers with supreme efficiency.',
      's_0e5ae2': 'Unified Service Hub',
      's_110158': 'Help Center',
      's_110820': 'Join hundreds of high-end resorts, boutique hotels, and luxury Airbnb hosts across East Africa that are boosting guest satisfaction and building zero-cost revenue.',
      's_176079': 'Preference Profiles',
      's_17d67c': 'Earnings Estimator',
      's_182ad0': 'Secure automated checkouts, verified premier concierge merchants, and licensed professional couriers guarantee safety and guest peace of mind.',
      's_18414d': 'Elite Fleet',
      's_1be9e5': 'Every QR code is uniquely tied to the guest suite, meaning food deliveries, room cleanings, or requested towels find guests exactly where they are.',
      's_1d2be9': 'Safety Guidelines',
      's_21f4bb': 'Happy Guests',
      's_25096d': 'Upfront Integration Cost',
      's_271358': 'Properties utilizing NEXG Contactless QR systems experience a massive increase in service engagement compared to conventional physical folders.',
      's_29b967': 'Properties CTA Sunset Background',
      's_2bf27f': 'STEP 01',
      's_31c559': 'Elevate Guest Experiences.',
      's_338ed9': 'Earn More Income',
      's_341a50': 'NEXG builds privacy-compliant guest preference profiles to help your staff pre-empt needs before they are even spoken out loud.',
      's_38769a': 'For Properties',
      's_3b6c18': 'Service Response Index',
      's_40c759': 'Average Occupancy Rate',
      's_4216f1': 'Trusted & Safe',
      's_46f477': 'Guests scan, order, and pay instantly. NEXG handles all fulfillment, depositing automatic commission shares to your dashboard.',
      's_49f179': 'We Handle Everything',
      's_4c36e1': 'SETUP TIMELINE',
      's_4d2dec': 'Local Adventures',
      's_4d81b2': 'STEP 03',
      's_4f7049': 'Estimated Monthly Share',
      's_4fdd58': 'Order Conversion Rate',
      's_52a6f3': 'For Partners',
      's_534294': 'We supply custom-crafted physical suite-specific QR cards. Place them in your room directories or high-visibility bedside tables.',
      's_53cdfb': 'DATA INTELLIGENCE',
      's_589ee1': 'Configure & Customise',
      's_5bfbb7': 'The QR Advantage',
      's_5fbc63': 'Unlock Property Potential.',
      's_70a8da': 'Stand Out',
      's_73ba7f': 'Chauffeurs & rentals',
      's_75dde0': 'Return to Guest App',
      's_785c45': 'Powerful Analytics for Modern Managers',
      's_7a1f3a': 'Position your properties as elite, technologically forward luxury destinations. Set a standard of hospitality others can\'t match.',
      's_7b1758': 'Private Cab & Car Hire shares',
      's_7bf908': 'Partner Onboarding',
      's_7c6eec': 'Transform guest behavior into highly actionable insights. Track ordering trends, optimize your staffing, and refine property offerings with real-time analytics.',
      's_7ee992': 'View Demo Video',
      's_818f94': 'Clear real-time transparency audit trail',
      's_8249e7': 'Food & Dining referrals',
      's_8332c9': 'Inventory Speed',
      's_872061': 'Deploy QR Displays',
      's_89bdbf': 'Elevating premium hospitality across East Africa with integrated, contactless concierge ecosystems.',
      's_8c288d': 'Submit your property and suite list online. Our concierge activation specialists verify your layout to launch your space.',
      's_8c8458': 'Why Hosts Choose NEXG',
      's_8d365a': 'Properties Daylight Hero Background',
      's_8e8592': 'Bespoke Tours & Safaris',
      's_8fe3e8': 'Apply & Partner',
      's_9ad0cc': 'Contact Us',
      's_9db108': 'Privacy Policy',
      's_9fd2f3': 'Stop leaving incremental hospitality revenue on the table. Our mutual commission-sharing model turns every guest service interaction into a direct revenue flow for your property, even when fulfilled entirely by trusted third-party merchants.',
      's_a1e9f9': 'Explore Home',
      's_a2cb3c': 'Guests simply point their camera and browse. No logins, no tedious app downloads, just premier high-end service in a couple of seconds.',
      's_a2f3a7': 'Enhanced Experience',
      's_a3fb7a': 'Fine Dining',
      's_a5d6a1': 'Zero integration overhead. Complete hotel setup, display delivery, and automatic digital catalog activation in under 48 hours.',
      's_a62509': 'REVENUE GENERATION',
      's_a9577d': 'Secure Site',
      's_a969aa': 'Safaris & excursions',
      's_a97bcc': 'Unlock a hands-off, zero-effort passive revenue stream by receiving high commission splits from every guest meal, ride, or tour booked.',
      's_aaa399': 'Passive Commissions',
      's_b74c4e': 'Toggle Theme',
      's_c24cae': 'STEP 02',
      's_c50b8f': 'Fully automated payouts and digital reporting',
      's_c5bb5d': 'Average Order Growth',
      's_c86934': 'Total Rooms / Suites',
      's_c887b9': 'About Us',
      's_c9bc84': 'Luxury Transport',
      's_cd4fe8': 'Partner with NEXG',
      's_ce7472': 'Back to Home',
      's_d08ccb': 'Zero Friction Interface',
      's_d15371': 'Delighted guests leave glowing feedback. Maximize your rating scores and booking ranks across Airbnb, Booking, and Expedia.',
      's_d178f4': 'Guest Habit Tracking',
      's_d300d6': 'Better Reviews',
      's_d5d3ea': 'We integrate premier local partner cuisines, spa offerings, and chauffeur fleets into a single, seamless brand-matching portal.',
      's_d8481d': 'Wellness & Spa',
      's_d887cc': 'Understand exactly what your guests prefer. Track peak booking periods, top fine dining cravings, and late-night requests.',
      's_e09921': 'Operational Optimization',
      's_e3b925': 'STEP 04',
      's_e56df8': 'WHY PARTNER WITH US',
      's_e6e178': 'Cookie Policy',
      's_e7f7ee': 'More Bookings',
      's_e87389': 'Loyalty Return Intent',
      's_ea763f': 'Apply for Partnership',
      's_ec3c35': 'Stay updated with premier hospitality tips and trends.',
      's_ee7b88': 'We seamlessly integrate previously fragmented premium local merchants into an elegant singular user experience reflecting your property’s status.',
      's_f04a9d': 'Absolutely zero operational burden for you. From partner restaurant execution to vetted courier logistics, NEXG does all the heavy lifting.',
      's_f59c46': 'Monetize Every Single Stay.',
      's_f77be3': 'Luxury suite with guest scanning QR code',
      's_f90548': 'Deliver unmatched, instant room service, organic spa appointments, and curated local safaris at the simple scan of a finger.',
      's_f907f8': 'One Elite App. Infinite Services.',
      's_fa3fc3': 'Average App Spend per Stay',
      's_fe3f95': 'THE ECOSYSTEM',
    },
    googleReviewsModal: {
      's_0d75a8': 'Google Maps Pin',
      's_273f6f': 'No Google reviews match your selected filter.',
      's_3ea133': 'Verified direct contacts & socials',
      's_6913b8': 'Search reviews for dishes, ambiance, speed...',
      's_6a6eaf': 'Filter by Stars',
      's_6bce42': 'Verified Aspect Scores',
      's_aaf427': 'Atmosphere & Reliability',
      's_ba9553': 'Quality & Execution',
      's_bd9554': 'Reviews synced in real-time with Google Places API',
      's_c34ae8': 'Aspect data collected via Google Places API',
      's_cbac3e': 'App Service',
      's_d45c4f': 'Official Portal',
      's_d6f49f': 'Verified Google Reviews',
    },
    groceriesPage: {
      's_160a42': 'Back to all Purveyors',
      's_340a24': 'Gourmet Cellar & Purveyors',
      's_48028b': 'Artisanal Cellar, Caviar & Fromagerie',
      's_504097': 'Fine Cellar & Epicurean Purveyors',
      's_7447ef': 'Search purveyors, caviar, Dom Pérignon, Bellota, truffles...',
      's_828ad2': 'Insulated Cold Packaging',
      's_a1e9f9': 'Explore Home',
      's_dcc1fb': 'Select Item',
    },
    header: {
      's_64f892': 'Toggle Light/Dark Theme',
      's_7abd6c': 'View Cart',
    },
    hero: {
      's_67300d': 'Clear search',
      's_7ecda2': 'عشاء فاخر في بنتهاوس ليلي مع أفق المدينة',
      's_c75a68': 'مسبح لا متناهٍ فاخر في بنتهاوس مشمس مع أفق المدينة',
      's_ece6e2': 'جناح فاخر ليلي',
    },
    hostOnboarding: {
      's_00679c': 'Who fulfills it?',
      's_013237': 'Use my location',
      's_0302c0': 'Reception desk, access code process, security desk, host contact, etc.',
      's_0d3b1e': 'Host Portal',
      's_10599c': 'Property name',
      's_10a49a': 'Add a space / unit type',
      's_120c32': 'How are guests identified within the property?',
      's_12e078': 'Name / label',
      's_1596ef': 'Bring your property into NEXG.',
      's_193de6': 'Your host application for',
      's_205866': 'Landmarks, gate instructions, building name, entrance, etc.',
      's_20687f': 'Settlement account',
      's_25916d': 'Price (optional)',
      's_25e7e1': 'Tell guests about the property',
      's_272c68': 'Property features',
      's_292d45': 'Examples of guest requests',
      's_2bbda0': 'For NEXG App Limited',
      's_33becf': 'You\'re ready for verification.',
      's_369c34': 'Property partner',
      's_3cc2c7': 'Signature pad',
      's_415e74': 'Guest capacity',
      's_421a0f': 'Short description of the property, atmosphere and what makes it distinctive...',
      's_486ffa': 'Authorized representative',
      's_49e09b': 'Tax / pricing setup',
      's_4a9200': 'Property / operating permit',
      's_4e17c4': 'By signing below, the authorized representative confirms that the submission is accurate and accepts the applicable NEXG host partnership terms presented during onboarding.',
      's_58eafa': 'Typical request fulfillment time',
      's_616ace': 'Legal / operating entity',
      's_62a764': 'If applicable',
      's_6372ac': 'Host onboarding',
      's_67745b': 'Start another',
      's_692b50': 'Building, street or road',
      's_7013c7': 'The Host remains responsible for the operation, safety, licensing, staffing, availability, pricing and fulfillment of property services. NEXG may coordinate guest requests, transactions and related workflows according to the agreed configuration.',
      's_75d65e': 'Your progress is saved locally on this device.',
      's_773613': 'Rooms / units',
      's_782667': 'HOST SETUP',
      's_7af122': 'Tap or click the map to set the exact property point.',
      's_7b12e1': 'Add the requests your team actually handles today.',
      's_7bba35': 'Property cover image',
      's_810878': 'Tell us what exists, what guests can access, and how your team operates. We\'ll use this to build your property profile and guest experience.',
      's_82c7e7': 'Back to the host portal',
      's_849305': 'Signature method',
      's_86adcf': 'Year opened',
      's_893bd7': 'Authorized signatory name',
      's_897c71': 'Clear signature',
      's_8ad7ea': 'Property type',
      's_8dc8f7': 'What would you like NEXG to help you expose to guests?',
      's_8e3c7a': 'Website / booking page',
      's_924da1': 'Describe your property type',
      's_93cfd5': 'What kind of property is it?',
      's_9550a5': 'Departments / teams available',
      's_99d32f': 'Back to host portal',
      's_9d617c': 'What can guests access or request?',
      's_a2a1b1': 'The Host agrees to maintain accurate property information and reasonable service availability, and to notify NEXG of material changes that could affect guest fulfillment.',
      's_a68df4': 'Check-in / arrival instructions',
      's_a6d2ea': 'The Host confirms that the information supplied about the property, its operating model, guest-accessible spaces and services is accurate to the best of their knowledge and that they are authorized to provide it.',
      's_a8dc5c': 'What does the property include?',
      's_aa1d9b': 'What do you want guests to transact for?',
      's_ae7f40': 'Check-out time',
      's_b45dc8': 'Anything you currently struggle to make visible, bookable, purchasable or easy for guests to request...',
      's_b501d3': 'Request / service',
      's_b50578': 'Upload square logo',
      's_b5508b': 'Property setup',
      's_be3ecd': 'Account holder name',
      's_bf72f7': 'Settlement details should be verified before activation. Do not use this form for card or wallet credentials.',
      's_c0b7d7': 'Pin the property',
      's_c250a9': 'Property access',
      's_c36127': 'Save / Print',
      's_ca1948': 'For Host',
      's_ca9b4a': 'How should guests find you?',
      's_cde9a5': 'Optional notes, amenities or access details',
      's_ce9840': 'Submitted information may be reviewed for onboarding, verification, operations, support, settlement and guest-experience purposes. Additional verification may be requested before activation.',
      's_d1d7c9': 'Full legal name',
      's_d90fdd': 'Operating model',
      's_e400b7': 'How do guest requests reach your team today?',
      's_e45952': 'Who should receive NEXG requests?',
      's_e4cee9': 'Application received',
      's_e61a08': 'M-PESA Till / Paybill',
      's_e9c696': 'Are you onboarding more than one property?',
      's_eb7eb7': 'Choose file',
      's_ecc61a': 'Please complete the highlighted fields before continuing.',
      's_edbfdd': 'Property logo',
      's_f0ac0a': 'Pending verification',
      's_f548ec': 'Business / registration document',
      's_f71497': 'Check-in time',
      's_faea7e': 'NEXG App Limited',
      's_fbd2e5': 'Registered company or operating name',
      's_ff1835': 'NEXG Operations',
    },
    languageSwitcher: {
      's_03e64a': 'تغيير اللغة (English، 中文، Kiswahili، العربية)',
      's_99547d': 'اختر لغة المنطقة',
      's_b8cc8e': 'محدد اللغة',
    },
    merchantAdCarousel: {
      's_297522': 'Sponsored partner offers',
      's_2d4e52': 'PARTNER SPOTLIGHT',
      's_3340de': 'Exclusive host and verified partner privileges',
      's_430fac': 'Enable location to see trending offerings near you',
    },
    merchantCard: {
      's_3beea0': 'Save to favorites',
      's_960d55': 'Popular offerings',
    },
    merchantItemModal: {
      's_062e79': 'Increase quantity',
      's_6c02ab': 'Decrease quantity',
    },
    merchantOnboarding: {
      's_00b623': 'Upload business certificates and company logos. These will be used to dynamically set up your store theme inside the NEXG customer application.',
      's_012a51': 'Please register the legal trading entities. Correct tax identifiers help guarantee smooth fast payouts.',
      's_01edab': 'Search Location Finder',
      's_02aa9a': 'Input branch parameters. You can search using Nominatim autocomplete finder or drop coordinates via the map.',
      's_0bd62e': 'Account Number',
      's_0cb1d6': 'Authorized Officer Signature',
      's_108c09': 'NEXG Riders Fleet',
      's_197803': 'Above 60 minutes',
      's_1c7169': 'Logo preview',
      's_1cf31b': 'Generated via map picker',
      's_20f7df': 'Closing Time *',
      's_21f543': 'Facebook page',
      's_22691e': 'Provide a brief summary of specialties, offerings, or history (max 150 characters)',
      's_26a2ff': 'Based on your category, select common sections to organize your items or add custom ones.',
      's_2eabdb': 'Partnership Agreement Contract',
      's_312631': 'Bank Name',
      's_39e42f': 'Interactive catalog listing on the premium NEXG Client App.',
      's_3e95c1': 'Nominate your payouts destinations. Weekly settlements are transferred directly every Monday morning.',
      's_3fa081': 'You selected',
      's_411097': 'None selected yet. Choose suggestions or add a custom one below.',
      's_4331e0': 'Holiday Closing Time',
      's_4baf91': 'Short Business Description',
      's_4f2047': 'Maintain exact availability schedules, correct pricing, and stock sync lists.',
      's_540d0d': 'Suggested Sections',
      's_550c6f': 'Register primary coordinates. Authorized officers receive system orders, accounts payouts auditing details, and alerts.',
      's_5664e0': 'The Merchant is solely responsible for clearing customs duties, port levies, and ensuring all shipping cargo meets international and local compliance standards.',
      's_59c22e': 'Upload Banner Image',
      's_5fa789': 'You can select multiple specific types if your outlet handles different luxury segments.',
      's_676418': 'Business Paybill No.',
      's_67de19': 'Provide premium white-glove deliveries & concierge orders to luxury customers in Kenya.',
      's_7122f5': 'Business Profile',
      's_71c904': 'NEXG APP LIMITED',
      's_721462': 'Director ID / Passport Scan',
      's_7308b8': 'Review the pre-drafted legal contract. Ensure all merchant parameters, locations, and banking details are correct.',
      's_8242a9': 'Upload business registration scan PDF or image.',
      's_85273b': 'Confirm Coordinates',
      's_869b48': 'NEXG Legal Representative',
      's_87a51d': 'Own Store Riders',
      's_89ac4c': 'Hours Configuration Template',
      's_8c1404': 'Instagram profile',
      's_91091f': 'Type landmark e.g. Yaya Centre, Westlands, Sarit...',
      's_91dd0b': 'TikTok profile',
      's_928d67': 'Coordinates Map Link',
      's_9441e0': 'Branch Manager / Contact Person',
      's_959d0c': 'For NEXG APP LIMITED',
      's_963f97': 'Average Preparation Time',
      's_9d4f8b': 'Type your full legal name',
      's_a03653': 'Expand Your Business with NEXG',
      's_a0b2cf': 'Search categories e.g. Food, Safe, Spa, Flight...',
      's_a133eb': 'Click to add',
      's_a4d472': 'NEXG operates logistics carriage from your store using our background-checked professional couriers.',
      's_a5d0ab': 'Certificate of Registration',
      's_abf9f4': 'Banner preview',
      's_b03404': 'Your premium merchant onboarding is complete. Our partnership audit committee will complete verify checks and activate your store front within 24 hours.',
      's_b32233': 'Website URL',
      's_b62775': 'Upload ID or passport of major primary director.',
      's_b639de': 'Add Section',
      's_b8579d': 'Payment Details',
      's_b9084a': 'Choose Category',
      's_b9f2b1': 'Operating Days',
      's_b9ffbd': 'Merchant Partnership Agreement',
      's_bb20e3': 'For THE MERCHANT',
      's_c05283': 'Choose the category that best aligns with your merchant store operations. Use search or filter down instantly.',
      's_c5955e': 'Opening Time *',
      's_c6846b': 'Signature drawing',
      's_d1bf6b': 'Kenyan Public Holidays Availability',
      's_d1d21f': 'Collection and processing of accounts charges from guests, tourists, and corporate networks.',
      's_d33bf6': 'Merchant Portal',
      's_d7a397': 'Branch Contact Phone',
      's_d890b7': 'Branch Location',
      's_db3b79': 'Account Name',
      's_e0a26d': 'Logistics carriage orchestration based on requested parameters.',
      's_e58331': 'Handwriting Style Preview',
      's_e79369': 'Store Branches & Location Map',
      's_eab077': 'Delivery Carriage Modes',
      's_eab952': 'WhatsApp Dispatch No.',
      's_ebaf4a': 'Paybill Account Name',
      's_ed6a3f': 'Holiday Opening Time',
      's_f1dd4c': 'Buy Goods Till No.',
      's_f7c245': 'Onboard Another Store',
      's_faea7e': 'NEXG App Limited',
    },
    merchantPage: {
      's_c902a1': 'Open Now',
    },
    merchantPreviewSheet: {
      's_0f4c5c': 'This merchant does not declare its own workflow, so the default for its category is shown.',
      's_28da6e': 'See all offerings',
      's_baa550': 'Close preview',
    },
    merchantRoute: {
      's_176135': 'The API may not be running. Start it with',
      's_a1ca54': 'Loading merchant',
      's_e84712': 'Go back',
    },
    merchantView: {
      's_085b31': 'No offerings listed yet',
      's_3fcbae': 'Menu sections',
      's_67300d': 'Clear search',
    },
    metricsDashboard: {
      's_048f2f': 'Status breakdown',
      's_0dd383': 'API version',
      's_1c8836': 'Built at',
      's_235f7b': 'Events accepted',
      's_236a59': 'Bars are per-bucket counts derived from the API\'s cumulative Prometheus buckets.',
      's_266384': '5xx error rate',
      's_406acb': 'Requests / minute',
      's_41e8de': 'Recent traces (/api/traces)',
      's_461aff': 'No spans buffered yet.',
      's_58b6dc': 'In flight',
      's_5dd968': 'Events dropped',
      's_65916f': 'Browser events arrive only from visitors who granted analytics consent.',
      's_74d595': 'No metrics available',
      's_74efa0': 'Metrics API unreachable.',
      's_75e157': 'The dashboard polls',
      's_8474ec': 'No samples yet.',
      's_886fb2': 'Client telemetry',
      's_9d5b00': 'Slowest routes (by p95)',
      's_a41501': 'Runtime, build and data source',
      's_b0ad50': 'No routes recorded yet.',
      's_c347b1': 'Service metrics',
      's_cc1e6a': 'Duration histogram',
      's_cec477': 'Last 60s',
      's_e4076f': 'Collecting samples. The line appears after the second poll.',
      's_ee9d59': 'Database reads',
      's_f8fd6e': 'No responses recorded yet.',
      's_ffb77d': 'Data source',
    },
    nexGCategoryDrilldown: {
      's_03f70c': 'Merchant Providers & Partners',
      's_09efe8': 'Choose a time',
      's_0df6f0': 'Switch Provider',
      's_0ecb20': 'Confirm & Reserve Instant Dispatch',
      's_126f44': 'Preferred Time',
      's_19ad69': 'Scheduled Date',
      's_1b8543': 'Reset All Filters',
      's_1f647f': 'Special Offers',
      's_27c636': 'Complete view',
      's_2994b4': 'Scroll right',
      's_2c9e5a': 'Scroll left',
      's_2f1873': 'All Items',
      's_34318e': 'Rating 4.8+',
      's_492026': 'Add to Order',
      's_4ce3f0': 'Select a Merchant Provider Above',
      's_50238f': 'No upfront charge. Escrow reservation handled by concierge desk.',
      's_543b1b': 'Your reservation for',
      's_5be698': 'Reset Filters',
      's_77bf79': 'Reserve / Book',
      's_7db318': 'Back to Discovery',
      's_8978ea': 'Decision Specifications',
      's_8bf67b': 'Nairobi Luxury District',
      's_9dca31': 'No items found matching your filters.',
      's_ab2d11': 'Under 25 min',
      's_c07c6d': 'Suite Number or Location Notes',
      's_c14e04': 'Browse catalog offerings with real-time pricing and availability',
      's_c25b51': 'Strict Category & Subcategory Catalog',
      's_d394a9': 'Highest Rated',
      's_e16a1d': 'Explore dedicated subcategories with specialized imagery and custom parameters',
      's_eb13c4': 'To view item cards, please click any of the verified merchant providers above. Their full 30-item catalog, specifications, and instant ordering will appear here.',
      's_fae58c': 'Clear Selection',
      's_fcdcf7': 'Fast selections & customer favorites',
    },
    nexGCollectionRail: {
      's_0b3917': 'Curated Collection',
      's_2994b4': 'Scroll right',
      's_2c9e5a': 'Scroll left',
      's_986032': 'Explore All',
    },
    nexGDiscoveryView: {
      's_6d9483': 'Browse verified Nairobi merchants across 20 neighborhoods with Wolt-grade previews',
      's_741311': 'Search food, spa, safaris, champagne, chauffeur...',
      's_76cb8c': 'Previous categories',
      's_844b94': 'Next categories',
      's_8f8796': 'High-priority concierge delivery direct to your suite or villa in under 30 minutes',
      's_a9176a': 'Explore Verticals & Categories',
      's_b0a3fc': 'All Verified Partners & Merchants',
      's_df4cf6': 'Instant Suite Express',
    },
    nexGEntityCard: {
      's_085ed0': 'View catalog & pricing',
    },
    nexGItemSheet: {
      's_0932f6': 'Special App Notes or Dietary Preferences',
      's_22b77f': 'Appointment & Scheduling',
      's_24a16c': 'Session Duration',
      's_3beea0': 'Save to favorites',
      's_65d22e': 'Close sheet',
      's_68f2d8': 'Preferred Date',
      's_693039': 'Time Slot',
      's_a99ee2': 'Number of Guests / Attendees',
      's_c6cf76': 'Added to Experience Order',
      's_d0e359': 'Curated Enhancements & Add-ons',
      's_eeea54': 'NEXG App Guarantee',
    },
    nexGLandingHero: {
      's_0b8149': 'Sign up',
      's_2bd100': 'Enter delivery address, villa or hotel suite...',
      's_381d79': 'Nairobi Villas',
      's_52a6f3': 'For Partners',
      's_71a30d': 'Change Delivery Location',
      's_e17357': 'Active App Fleet in Nairobi',
      's_f7c400': 'Log in',
      's_fa918a': 'Locate my position',
    },
    nexGSearchEngine: {
      's_c5b914': 'No direct matches found',
      's_cd81f4': 'Search Results for',
    },
    offercarousel: {
      's_10bb09': 'Previous Slide',
      's_2aa5dc': 'View Offer',
      's_7141bc': 'Next Slide',
    },
    orderTrackingModal: {
      's_116632': 'Estimated Delivery',
      's_375813': 'Fast forward simulation to next lifecycle stage',
      's_43301e': 'Call Courier',
      's_536456': 'Courier Tip',
      's_61243a': 'Simulated Payment Method',
      's_6e6109': 'Copy delivery security PIN',
      's_74e226': 'Itemized Receipt & PIN',
      's_84e3ee': 'Dismiss / Back to App',
      's_976a74': 'Transaction Reference',
      's_9c12c6': 'Delivery Fee',
      's_9ca905': 'This is an automated simulation of the client ordering lifecycle in NEXG App. No actual payment provider has been billed. Once connected to the live API gateway, genuine payments will be processed via M-Pesa or Stripe.',
      's_9fb5a8': 'Delivery PIN',
      's_a392ce': 'Live Progress Stages',
      's_b868ce': 'Message Courier',
      's_cbac3e': 'App Service',
      's_cd1876': 'Your Location',
      's_d6e963': 'Minimize tracking',
      's_ea2152': 'Live Journey & ETA',
      's_f56564': 'On schedule',
    },
    productcarousel: {
      's_10bb09': 'Previous Slide',
      's_7141bc': 'Next Slide',
    },
    promo: {
      's_38769a': 'For Properties',
      's_4a421c': 'For Merchants',
      's_c63982': 'For Couriers',
      's_d2c984': 'NEXG App App Interface',
    },
    restaurantDetailModal: {
      's_034ad6': 'Recent Google Reviews',
      's_116c19': 'Hospitality & Service',
      's_3beea0': 'Save to favorites',
      's_4f2130': 'Google Restaurant Reviews',
      's_52aed7': 'Food Quality',
      's_56ba29': 'No dishes match your search criteria.',
      's_649ff9': 'Add to order',
      's_652bc8': 'Posted on Google',
      's_79db72': 'View & Write Reviews',
      's_79fe15': 'View Google Reviews',
      's_9c203d': 'Artisanal Menu',
      's_9f068b': 'Verified Place',
      's_a023e6': 'Chef Pick',
      's_b05630': 'Synced Live',
      's_b38795': 'Search dishes...',
      's_c152be': 'No Google reviews loaded for this venue.',
      's_e1c6bf': 'Atmosphere & Transport',
      's_f4657b': 'Google Maps Rating',
    },
    restaurants: {
      's_0721cf': 'Your reservation at',
      's_072c89': 'Reserve Table',
      's_0c8f01': 'Table Reservation',
      's_25b120': 'Selected Reservation',
      's_2c3b25': 'Confirm Table',
      's_34df71': 'Search dining partners, sushi, dry-aged steaks, pasta...',
      's_4f9fa0': 'Google Maps Location',
      's_5be698': 'Reset Filters',
      's_5f716b': 'Try adjusting your search keywords or resetting cuisine filters.',
      's_6b2c05': 'Fine Dining Partners',
      's_7288fd': 'Fine Dining Partners & Master Chefs',
      's_868fb0': 'Click any dish to configure ingredients, accompaniments, or place a simulated order',
      's_99256e': 'Curated Culinary Directory',
      's_9da221': 'Featured Partner',
      's_a1e9f9': 'Explore Home',
      's_ae0cb2': 'Signature Dishes & Menu Offerings',
      's_bf0c7d': 'Back to all Dining Partners & Merchants',
      's_cfdf8b': 'Search menu dishes...',
      's_d97dd5': 'View Google Reviews & Diner Insights',
      's_dde236': 'Customize & Order',
      's_e25e77': 'Select a merchant to explore their Michelin-grade menu, signature dishes, verified Google diner reviews, and table reservations.',
      's_eac205': 'No dining partners match your filters',
    },
    routeFallback: {
      's_1c5772': 'جارٍ تحميل الصفحة',
    },
    scrollToTop: {
      's_f07710': 'الرجوع إلى الأعلى',
    },
    spaBookingModal: {
      's_039d05': 'Experience Setting',
      's_09121f': 'Appointment Slot',
      's_15ddf4': 'District Wellness Experience',
      's_17548b': 'Slot Scheduled',
      's_2fd731': 'Signature Aromatherapy Oil',
      's_301d19': 'Live Dispatch Progress',
      's_4548b7': 'Our certified therapist will arrive 10 minutes prior with sanitized organic towels, ultrasonic mist diffuser, and a heated memory-foam bed.',
      's_485336': 'Villa / Suite Number',
      's_4b8ec9': 'Private In-Villa Sanctuary',
      's_5621b9': 'Focus Areas & Medical Notes',
      's_712231': 'Contact Spa Concierge',
      's_7d1e9d': 'Private oceanfront cabana with thermal plunge pool & tranquil zen garden access.',
      's_8cff8d': 'Total Experience Fee',
      's_9092d9': 'Add to Calendar',
      's_9505aa': 'Total Concierge Charge',
      's_950d86': 'Massage Pressure Preference',
      's_9a36a0': 'Confirm Spa Booking',
      's_9e603c': 'Therapist dispatches directly to your villa with heated table, organic linens & aromatherapy.',
      's_a027ba': 'Select Ritual Duration',
      's_b3a5a1': 'Concierge In-Villa Service Protocol',
      's_be9475': 'Therapist Preference',
      's_c0a672': 'Appointment Confirmed',
      's_c8c5fe': 'Primary Guest Name',
      's_f00e02': 'Assigned Master Therapist',
      's_f79d9c': 'Resort Spa Pavilion',
    },
    spaWellness: {
      's_120405': 'Select Ritual',
      's_3669be': 'Book Calendar',
      's_5276ac': 'Your appointment at',
      's_5dfb4e': 'Spa & Wellness Sanctuaries',
      's_659a92': 'Search spa sanctuaries, Balinese, deep tissue, sauna...',
      's_689bea': 'Back to all Sanctuary Partners',
      's_69d23c': 'District Holistic Wellness & Spa',
      's_9aabe9': 'Book Session',
      's_a1e9f9': 'Explore Home',
      's_c1c2fb': 'Sanctuary Spas & In-Villa Wellness',
      's_d02cb4': 'Search rituals & massages...',
      's_eb9e1e': 'Confirm Booking',
      's_f212ea': 'Spa Sanctuary Reservation',
      's_f2937f': 'Select duration, botanical essential oils, and schedule an immediate in-villa or pavilion appointment',
      's_fda6e0': 'Select a wellness sanctuary to browse certified therapists, in-villa Balinese massages, Ayurvedic Shirodhara, and hydrothermal rituals.',
      's_fe0476': 'Sanctuary Treatments & In-Villa Rituals',
    },
    stats: {
      's_034abd': 'From hotels to homes, we make everyday exceptional.',
      's_826dd3': 'Hotel Partners',
      's_bd3fa2': 'Our Partners',
      's_dc04b9': 'Dar es Salaam',
      's_e819e6': 'Concierge Support',
      's_f2a377': 'Trusted by guests',
    },
    transportBookingModal: {
      's_1505c5': 'Live Dispatch Status',
      's_160ad9': 'Chauffeur Confirmed',
      's_251e18': 'Dedicated Chauffeur Hours',
      's_314bee': 'Total Concierge Fee',
      's_358b66': 'Pickup Time',
      's_36a60c': 'Done & Return to App',
      's_39b21c': 'Call Chauffeur',
      's_457b66': 'Total Rate',
      's_6f672b': 'Assigned Chauffeur',
      's_77ae94': 'Scheduled Departure',
      's_7a4175': 'Schedule Date',
      's_8941e9': 'Service Type',
      's_8dea76': 'Pickup Location',
      's_99d1c7': 'Confirm VIP Chauffeur',
      's_9ca1bd': 'Day After',
      's_a1cbc4': 'VIP Meet & Greet + Airport Flight Sync',
      's_b68827': 'Villa / Suite Room',
      's_be057d': 'Guest Name',
      's_cd11b4': 'Complimentary On-Board Amenities',
      's_d0cd2d': 'Flight Number / Departure Code',
      's_efb6c4': 'Continue to Amenities',
      's_f2f922': 'VIP Concierge Mobility',
    },
    transportPage: {
      's_1836d5': 'Choose a luxury mobility merchant to view available Maybach S680s, Rolls-Royce Ghost motorcars, Cadillac Escalade ESVs, or twin-engine helicopter transfers.',
      's_1afb28': 'Back to all Mobility Partners',
      's_2ea911': 'Chauffeur Reservation',
      's_3390d4': 'Reserve Chauffeur',
      's_3727e7': 'Book Transfer',
      's_52b224': 'VIP Chauffeur & Mobility Providers',
      's_543b1b': 'Your reservation for',
      's_784e6e': 'Search mobility providers, Maybach, Rolls-Royce, helicopter...',
      's_875bd6': 'Executive Chauffeurs & Private Aviation',
      's_898adc': 'VIP White-Glove Mobility',
      's_93f4b8': 'Pickup Date & Time',
      's_a1e9f9': 'Explore Home',
      's_eac49e': 'Book Vehicle',
      's_eb9e1e': 'Confirm Booking',
    },
    unifiedItemModal: {
      's_0125ec': 'View All Reviews',
      's_1cc3d0': 'Aromatherapy Essential Oil',
      's_3c0047': 'Dedicated Appointment Calendar',
      's_4c13f0': 'App Notes & Villa Details',
      's_5d14d6': 'E.g. Villa Suite 402, gate access code, dietary allergies, or arrival notes...',
      's_94c578': 'Confirm Calendar Reservation',
      's_a027ba': 'Select Ritual Duration',
      's_bf3b18': 'Add to App Cart',
      's_ee3e2e': 'About this offering',
      's_ee749a': 'Total Estimate',
    },
  },

  /*
    SHARED FORM VOCABULARY.

    These are the strings that appear on more than one form — an email label on four onboarding
    flows, "Save draft" on three. Extracting them means a later component references a key that
    already exists rather than adding a fifty-first way to say "Full name".

    Scoped deliberately: it holds what is genuinely common and nothing else. Form-specific copy
    ("Driver's License Expiry Date", "E.g. KMCA 123A") stays with its own screen, because
    collecting one-off strings into a shared block is how a shared block becomes unmaintainable.

    Placeholders use {braces} where a value is substituted. See forms.stepOf.
  */
  forms: {
    actionSave: 'حفظ',
    actionSaveDraft: 'حفظ المسودة',
    actionContinue: 'متابعة',
    actionBack: 'رجوع',
    actionNext: 'التالي',
    actionCancel: 'إلغاء',
    actionConfirm: 'تأكيد',
    actionSubmit: 'إرسال',
    actionReview: 'مراجعة',
    actionEdit: 'تعديل',
    actionRemove: 'إزالة',
    actionUpload: 'تحميل',
    actionTryAgain: 'حاول مرة أخرى',
    fullName: 'الاسم الكامل',
    emailAddress: 'البريد الإلكتروني',
    phoneNumber: 'رقم الهاتف',
    whatsappNumber: 'رقم واتساب',
    nationalId: 'رقم الهوية الوطنية',
    dateOfBirth: 'تاريخ الميلاد',
    county: 'المقاطعة / المنطقة',
    addressStreet: 'العنوان / الشارع',
    areaNeighbourhood: 'المنطقة / الحي',
    preferredContact: 'طريقة التواصل المفضلة',
    documentType: 'نوع المستند',
    documentUpload: 'تحميل المستند',
    documentExpiry: 'تاريخ الانتهاء',
    businessRegistration: 'وثيقة تسجيل الشركة',
    taxPin: 'الرقم الضريبي',
    certificateOfIncorporation: 'شهادة التأسيس',
    bankName: 'اسم البنك',
    accountName: 'اسم الحساب',
    accountNumber: 'رقم الحساب',
    branchName: 'الفرع',
    mobileMoneyNumber: 'رقم المحفظة الإلكترونية',
    paymentMethod: 'طريقة الدفع',
    chooseDate: 'اختر تاريخاً',
    chooseOption: 'اختر خياراً',
    selectYourRole: 'اختر دورك',
    yes: 'نعم',
    no: 'لا',
    optional: 'اختياري',
    required: 'مطلوب',
    thisFieldRequired: 'هذا الحقل مطلوب',
    enterValidEmail: 'أدخل بريداً إلكترونياً صالحاً',
    enterValidPhone: 'أدخل رقم هاتف صالحاً',
    selectOneOption: 'الرجاء اختيار أحد الخيارات',
    uploadRequired: 'الرجاء تحميل المستند المطلوب',
    stepOf: 'الخطوة {current} من {total}',
    unsavedChanges: 'لديك تغييرات غير محفوظة',
    placeholderFullName: 'اسمك الكامل',
    placeholderEmail: 'you@example.com',
    placeholderPhoneKe: '+254 7XX XXX XXX',
    placeholderExample: 'مثال: {value}',
  },
    nav: {
      home: 'الرئيسية',
      explore: 'استكشف',
      restaurants: 'المأكولات الفاخرة',
      spa: 'السبا والعافية',
      spaDistrict: 'المنطقة الخاصة',
      transport: 'تنقل كبار الشخصيات',
      groceries: 'المشروبات والمؤن',
      experiences: 'تجارب حصرية',
      partners: 'الشركاء',
      forProperties: 'للفنادق والمنتجعات',
      forCouriers: 'انضم لأسطول النخبة',
      forMerchants: 'للمطاعم والمتاجر',
      partnerOnboarding: 'طلب انضمام الشركاء',
      applyFleet: 'انضم لأسطول النخبة',
      listBusiness: 'سجل نشاطك التجاري',
      track: 'تتبع الطلب',
      viewCart: 'حقيبة الكونسيرج',
      appearanceMode: 'وضع المظهر',
      lightMode: 'الوضع النهاري',
      darkMode: 'الوضع الليلي الهادئ',
      selectLanguage: 'اختر اللغة',
      menu: 'القائمة',
      close: 'إغلاق',
    },
    hero: {
      badge: 'كونسيرج الضيافة الفندقية الفاخرة',
      titleLine1: 'كل ما ترغب به،',
      titleLine2: 'في مكان إقامتك تماماً.',
      subtitle: 'اطلب أرقى أطباق الطهاة العالميين، احجز جلسات تدليك استرخائية في فيلتك، اطلب سيارات مايباخ مع سائق خاص، وتمتع بتوصيل فوري متميز مباشرة إلى باب جناحك أو مسبحك الخاص.',
      searchPlaceholder: 'ابحث عن مطعم، سبا، سيارة',
      searchBtn: 'بحث',
      popular: 'الأكثر طلباً:',
      sugMichelin: 'أطباق ميشلان',
      sugMassage: 'مساج بالينيزي',
      sugMaybach: 'سائق مايباخ VIP',
      sugCaviar: 'كافيار ومشروبات نادرة',
      sugYacht: 'يخت خاص',
      btnFineDining: 'مطاعم فاخرة',
      btnSpa: 'السبا والاستجمام',
      btnMobility: 'تنقل كبار الشخصيات',
      ambienceDaylight: 'أجواء النهار المشرقة',
      ambienceTwilight: 'أجواء المساء الساحرة',
    },
    categories: {
      heading: 'فئات خدمات الكونسيرج المتاحة',
      subtitle: 'اختر أي فئة أدناه لتصفح خيارات تناول الطعام في الجناح، جلسات السبا، والسيارات الفاخرة.',
      groceriesTitle: 'المؤن والمشروبات',
      groceriesDesc: 'أرقى المشروبات والكافيار ومؤن الفيلا الطازجة',
      transportTitle: 'المواصلات الفاخرة',
      transportDesc: 'استقبال المطار بمايباخ، رولز رويس ومروحيات',
      spaTitle: 'السبا والاستجمام',
      spaDesc: 'تدليك بالينيزي داخل الفيلا وعناية بالبشرة',
      restaurantsTitle: 'المطاعم الراقية',
      restaurantsDesc: 'خدمة غرف مميزة من طهاة ميشلان العالميين',
      experiencesTitle: 'تجارب استثنائية',
      experiencesDesc: 'رحلات يخوت خاصة، جولات هليكوبتر وبولو',
      essentialsTitle: 'المستلزمات الفاخرة',
      essentialsDesc: 'عناية شخصية وصحة وترطيب فائق',
      viewAll: 'استكشف كافة الخدمات',
    },
    howItWorks: {
      badge: 'سوق خدمات NEXG',
      heading: 'NEXG تجمع خدمات نيروبي',
      subtitle: 'استكشف الخدمات، اختر ما تحتاجه، ثم اطلب أو احجز أو أرسل طلباً في ثلاث خطوات.',
      step1Title: 'امسح الرمز أو افتح الموقع',
      step1Desc: 'امسح رمز QR داخل الجناح أو افتح الموقع من أي جهاز دون الحاجة لتحميل تطبيقات.',
      step2Title: 'اكتشف 21 فئة من الخدمات',
      step2Desc: 'اكتشف المطاعم والبقالة والصيدليات والعافية والتنقل والتجارب المحلية وغيرها في سوق واحد.',
      step3Title: 'اطلب أو احجز أو أرسل طلباً',
      step3Desc: 'اختر الإجراء المتاح: اطلب منتجاً، احجز خدمة، أرسل طلب خدمة أو استفسر عن السعر.',
    },
    promo: {
      badge: 'امتيازات النزلاء الحصرية',
      heading: 'توصيل كونسيرج مجاني على طلبك الأول',
      desc: 'تمتع بإعفاء كامل من رسوم التوصيل على جميع مطاعم ميشلان والمؤن الفاخرة باستخدام رقم غرفتك.',
      cta: 'استكشف المأكولات الآن',
      code: 'رمز الامتياز: VILLA2026',
      appHeading1: 'احمل NEXG',
      appHeading2: 'في كل مكان',
      appSubtitle: 'التطبيق الشامل المتكامل للنزلاء والمقيمين والمسافرين.',
      downloadOn: 'حمله من',
      appStore: 'App Store',
      getItOn: 'احصل عليه من',
      googlePlay: 'Google Play',
      merchantsTitle: 'للشركاء والتجار',
      merchantsDesc: 'نمّ أعمالك الفاخرة مع NEXG.',
      merchantsCta: 'كن شريكاً معنا',
      couriersTitle: 'للسائقين والمناديب',
      couriersDesc: 'قدّم التميز. انضم لأسطولنا الفاخر.',
      couriersCta: 'قدم طلبك الآن',
      propertiesTitle: 'للفنادق والمنتجعات',
      propertiesDesc: 'ارتقِ بتجربة ضيوفك الاستثنائية.',
      propertiesCta: 'سجل عقارك معنا',
    },
    features: {
      badge: 'التميز والموثوقية',
      heading: 'معايير الضيافة الفندقية العالمية',
      subtitle: 'لماذا تعتمد أفخم المنتجعات والقصور الخاصة والنزلاء المميزون على NEXG.',
      feat1Title: 'كونسيرج خاص على مدار الساعة 24/7',
      feat1Desc: 'دعم متعدد اللغات لتلبية التفضيلات الغذائية، الحجوزات الخاصة والتوصيل المجدول.',
      feat2Title: 'طهاة ميشلان ونخبة الشركاء',
      feat2Desc: 'ربط مباشر بأشهر معالم الضيافة وخبراء السبا المعتمدين دولياً.',
      feat3Title: 'أعلى درجات الخصوصية والأمان',
      feat3Desc: 'دفع مشفر على حساب الغرفة، توصيل آمن بدون تلامس وسرية تامة لبيانات النزلاء.',
      feat4Title: 'أسطول مجهز بحافظات حرارية ذكية',
      feat4Desc: 'مركبات فاخرة وصناديق حرارية متطورة تضمن وصول الأطباق والمشروبات في قمة جودتها.',
      f1Title: 'دفع آمن ومحمي',
      f1Desc: 'مشفر ومحمي بالكامل',
      f2Title: 'تتبع لحظي للطلب',
      f2Desc: 'اعرف موقعه بدقة',
      f3Title: 'خيارات دفع متعددة',
      f3Desc: 'بطاقات بنكية، M-Pesa والمزيد',
      f4Title: 'توصيل سري وفائق الخصوصية',
      f4Desc: 'خصوصية تامة مضمونة',
    },
    restaurants: {
      title: 'المطاعم الفاخرة وخدمة الغرف',
      subtitle: 'قوائم طعام منتقاة من أشهر المطابخ العالمية تُقدم ساخنة مباشرة إلى مائدتك.',
      searchPlaceholder: 'ابحث عن مطعم، سوشي، واغيو، باستا الكمأة...',
      filterAll: 'جميع المطابخ',
      filterJapanese: 'ياباني / أوماكاسي',
      filterItalian: 'إيطالي / باستا يدوية',
      filterFrench: 'فرنسي راقٍ',
      filterMediterranean: 'متوسطي',
      filterSteakhouse: 'ستيك هاوس ومشاوي',
      filterDesserts: 'حلويات فاخرة',
      viewMenu: 'عرض القائمة',
      minOrder: 'الحد الأدنى',
      deliveryTime: 'وقت التوصيل المتوقع',
      featuredDish: 'طبق الشيف المميز',
      addToBag: 'إضافة للحقيبة',
      closed: 'مغلق للتحضير',
      openNow: 'متاح للطلب الآن',
    },
    spa: {
      title: 'السبا والعافية في ملاذك الخاص',
      subtitle: 'حوّل فيلتك إلى واحة هادئة للاسترخاء مع أمهر أخصائيي التدليك والعناية بالعالم.',
      bookTreatment: 'حجز جلسة علاجية',
      duration: 'المدة',
      inVilla: 'داخل الفيلا / الجناح',
      sanctuary: 'جناح السبا بالمنتجع',
      therapistGender: 'تفضيل المعالج',
      anyTherapist: 'لا تفضيل محدد',
      femaleTherapist: 'أخصائية علاج',
      maleTherapist: 'أخصائي علاج',
      reserveNow: 'تأكيد الحجز فوراً',
    },
    transport: {
      title: 'تنقل كبار الشخصيات مع سائق خاص',
      subtitle: 'سيارات مايباخ، رينج روفر VIP، ومروحيات هليكوبتر جاهزة لنقلك فوراً.',
      chauffeurIncluded: 'يشمل سائقاً خاصاً بالقفازات البيضاء',
      perHour: '/ ساعة',
      airportTransfer: 'استقبال وتوديع المطار VIP',
      bookChauffeur: 'حجز سيارة',
      capacity: 'المقاعد',
      luggage: 'سعة الأمتعة',
      instantDispatch: 'إرسال فوري ذو أولوية',
    },
    groceries: {
      title: 'المشروبات الفاخرة ومؤن الفيلا',
      subtitle: 'كافيار بيلوغا الفاخر، مشروبات نادرة، أجبان فاخرة، ومخبوزات الصباح الطازجة.',
      cellar: 'المشروبات الفاخرة',
      pantry: 'مؤن الفيلا الراقية',
      caviar: 'الكافيار والمقبلات الملكية',
      bakery: 'مخبوزات الصباح الطازجة',
      addToCart: 'إضافة لقائمة الطلب',
      inStock: 'جاهز للتوصيل الفوري',
    },
    experiences: {
      title: 'تجارب كبار الشخصيات المصممة خصيصاً',
      subtitle: 'رحلات يخوت بحرية خاصة، جولات هليكوبتر في الأفق، تخييم صحراوي ملكي، ودروس بولو.',
      bookExperience: 'استفسار وحجز',
      groupSize: 'أقصى عدد للضيوف',
      duration: 'مدة التجربة',
      vipHostIncluded: 'مضيف كونسيرج خاص متواجد',
    },
    cart: {
      title: 'حقيبة طلبات الكونسيرج',
      emptyTitle: 'حقيبة الطلبات فارغة',
      emptyDesc: 'تصفح أشهى الأطباق، جلسات السبا، المشروبات الفاخرة أو السيارات الفارهة لبدء طلبك.',
      exploreBtn: 'استكشف الخدمات الفاخرة',
      subtotal: 'المجموع الفرعي',
      deliveryFee: 'رسوم التوصيل الفاخر',
      conciergeService: 'رسوم خدمة الكونسيرج (5%)',
      total: 'المبلغ الإجمالي',
      checkoutBtn: 'المتابعة لتفويض الدفع بالغرفة',
      villaPlaceholder: 'رقم الفيلا / الجناح / البنتهاوس',
      specialNotes: 'ملاحظات خاصة للشيف أو موعد التوصيل...',
      orderPlaced: 'تم تقديم طلبك بنجاح!',
      items: 'عناصر',
      clearCart: 'تفريغ الحقيبة',
    },
    tracking: {
      title: 'تتبع مسار الكونسيرج المباشر',
      orderNumber: 'رقم الطلب',
      estimatedArrival: 'الوقت المتوقع للوصول',
      mins: 'دقيقة',
      statusConfirmed: 'تم تأكيد الطلب من قبل الكونسيرج',
      statusPreparing: 'جارٍ التحضير بعناية فائقة',
      statusInTransit: 'المندوب في الطريق إلى فيلتك',
      statusDelivered: 'تم التسليم عند باب الفيلا',
      courierAssigned: 'مندوب التوصيل المخصص',
      contactConcierge: 'الاتصال بمكتب الكونسيرج',
      close: 'تصغير شاشة التتبع',
    },
    footer: {
      brandDesc: 'المنصة الرائدة لخدمات الكونسيرج والضيافة الفندقية الفاخرة. نربط منتجعات الخمس نجوم والفلل الخاصة والنزلاء المميزين بأرقى الطهاة وأخصائيي السبا وأساطيل التنقل الفارهة.',
      exploreTitle: 'خدمات الكونسيرج',
      partnersTitle: 'الشركات والشركاء',
      legalTitle: 'الضمان والخصوصية',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      cookies: 'إعدادات ملفات تعريف الارتباط',
      rightsReserved: 'جميع الحقوق محفوظة. NEXG كونسيرج الدولية.',
      language: 'اللغة / المنطقة',
      craftedWith: 'صُمم خصيصاً لضيافة فنادق الخمس نجوم الفاخرة',
      aboutText: 'الضيافة بأسلوب مبسط. نرتقي بتجربة التوصيل المنتقى والكونسيرج الخاص في كينيا.',
      verticals: 'خدماتنا',
      fineDining: 'المأكولات الفاخرة',
      spaWellness: 'السبا والعافية',
      vipMobility: 'تنقل كبار الشخصيات',
      gourmetCellar: 'المشروبات الفاخرة',
      experiences: 'تجارب استثنائية',
      partners: 'الشركاء',
      forMerchants: 'للشركاء والتجار',
      forCouriers: 'للسائقين',
      forProperties: 'للفنادق والمنتجعات',
      legalSupport: 'القانون والدعم',
      conciergeDesk: 'مكتب الكونسيرج',
      termsOfService: 'شروط الخدمة',
      privacyPolicy: 'سياسة الخصوصية',
      safetyStandards: 'معايير السلامة',
      connect: 'تواصل معنا',
      rights: '© 2026 NEXG كونسيرج. جميع الحقوق محفوظة.',
      simulatedNotice: 'عرض توضيحي لبوابة الدفع (في انتظار الربط المباشر)',
    },
    partnerHeaders: {
      ecosystem: 'المنظومة',
      qrTech: 'تقنية QR',
      revShareCalc: 'حاسبة الأرباح',
      integrations: 'التكامل التقني',
      benefits: 'المزايا',
      logistics: 'اللوجستيات',
      howItWorks: 'كيف نعمل',
      categories: 'الفئات',
      earningsCalc: 'حاسبة الدخل',
      fleetPerks: 'مزايا الأسطول',
      standards: 'المعايير',
      faq: 'الأسئلة الشائعة',
    },
    partnersPortal: {
      merchantTitle: 'شركاء الأعمال والمطاعم',
      merchantSubtitle: 'وسع نطاق أعمالك الفاخرة لتصل إلى نزلاء فلل الخمس نجوم والأجنحة الملكية.',
      courierTitle: 'أسطول النخبة',
      courierSubtitle: 'قدّم طلبات الكونسيرج الفاخرة واكسب أعلى العوائد والمكافآت السخية.',
      propertiesTitle: 'للفنادق والمنتجعات',
      propertiesSubtitle: 'منظومة ضيافة داخل الأجنحة بدون نفقات رأسمالية مع مشاركة فورية للأرباح.',
      backHome: 'العودة لكونسيرج الضيوف',
      listBusiness: 'سجل نشاطك التجاري',
      applyFleet: 'انضم لأسطول النخبة',
      partnerNexg: 'كن شريكاً مع NEXG',
      onboardingActive: 'نشط',
      onboardingStatus: 'حالة التسجيل',
      stepText: 'الخطوة',
      ofText: 'من',
      nextStep: 'الخطوة التالية',
      prevStep: 'السابق',
      submitApplication: 'إرسال طلب الانضمام',
      agreementTitle: 'اتفاقية شروط الشراكة',
      agreementDesc: 'يرجى مراجعة الشروط والأحكام والتوقيع الرقمي أدناه.',
      successTitle: 'تم إرسال طلب الانضمام بنجاح!',
      successDesc: 'ستقوم لجنة اعتماد الشركاء بمراجعة بياناتك والتواصل معك خلال 24 ساعة.',
      returnHome: 'العودة للرئيسية',
      downloadSummary: 'تحميل ملخص الطلب PDF',
      riderPortal: 'بوابة السائقين والمناديب',
      eastAfricaSecure: 'شرق أفريقيا • تسجيل آمن',
      backToSite: 'العودة للموقع',
      activeStatus: 'نشط',
    },
  },
};

/** Exact English-source matches inside `ui`; this is a progress signal, not a quality score. */
function countSourceMatches(source: unknown, translated: unknown): number {
  if (typeof source === 'string') return source === translated ? 1 : 0;
  if (!source || typeof source !== 'object' || !translated || typeof translated !== 'object') return 0;
  return Object.entries(source).reduce((count, [key, sourceValue]) => {
    return count + countSourceMatches(sourceValue, (translated as Record<string, unknown>)[key]);
  }, 0);
}

export const PENDING_TRANSLATIONS = {
  zh: countSourceMatches(translations.en.ui, translations.zh.ui),
  sw: countSourceMatches(translations.en.ui, translations.sw.ui),
  ar: countSourceMatches(translations.en.ui, translations.ar.ui),
} as const;
