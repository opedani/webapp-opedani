module.exports = {
  apps : [{
    name               : 'webapp-opedani',
    script             : 'webapp-opedani/app.js',
    instances          : 'max',
    max_memory_restart : '256M'
  }]
};
