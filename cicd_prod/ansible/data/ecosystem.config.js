module.exports = {
  apps : [{
    name               : 'webapp-opedani',
    script             : 'webapp-opedani/app.js',
    watch              : ['webapp-opedani'],
    watch_delay        : 60,
    instances          : 'max',
    max_memory_restart : '256M'
  }]
};
