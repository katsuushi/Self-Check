// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_late_lockheed.sql';
import m0001 from './0001_quiet_scrambler.sql';
import m0002 from './0002_flimsy_virginia_dare.sql';
import m0003 from './0003_eager_blob.sql';
import m0004 from './0004_far_kang.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004
    }
  }
  