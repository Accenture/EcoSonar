import winston from 'winston'

class LoggerService { }
// Create a Winston logger with transports 
// for  logging to console and file 
let alignColorsAndTime = winston.format.combine(
  winston.format.label({
      label:'[LOGGER]'
  }),
  winston.format.timestamp({
      format:"YYYY-MM-DD HH:mm:ss"
  }),
  winston.format.printf(
      info => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
  )
);
  
export const logger = winston.createLogger({
  level: "debug",
  transports: [
      new (winston.transports.Console)({
          format: winston.format.combine(alignColorsAndTime)
      }),
      new winston.transports.File({
        format: winston.format.combine(alignColorsAndTime), 
        filename: 'app.log' 
    }) 
  ],
});

const loggerService = winston.createLogger(logger);
export default loggerService