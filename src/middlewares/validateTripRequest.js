const validateEditRequest = (req, res, next) => {
  const {
    type, reason, passportName,
    from, to, arrivalDate,
    departureDate, accommodation, id
  } = req.body;

  const specialCharaceterRegex = /^(?=.*[!@#$%^.,&*])/;

  const errors = [];

  const validtypes = ['one-way', 'multi-city', 'round-trip'];


  if (!passportName) errors.push('a passport name is required');
  if (!reason) errors.push('a reason for your request is required');
  if (!type) errors.push('a request type is required');
  if (!from) errors.push('at least one origin is required');
  if (!to) errors.push('at least one destination is required');
  if (!departureDate) errors.push('at least one departure date is required');
  if (!accommodation) errors.push('at least one accommodation is required');
  if ((type && type === 'round-trip') && !arrivalDate) errors.push('at least one arrival date is required');
  if (from && !Array.isArray(from)) errors.push('origin must be an array');
  if (to && !Array.isArray(to)) errors.push('destination must be an array');
  if (accommodation && !Array.isArray(accommodation)) errors.push('accommodation must be an array');
  if (arrivalDate && !Array.isArray(arrivalDate)) errors.push('return date must be an array');
  if (departureDate && !Array.isArray(departureDate)) errors.push('travel date must be an array');
  if (id && !Array.isArray(id)) errors.push('trip ids must be an array');

  if (from && Array.isArray(from)) {
    from.forEach(origin => {
      if (typeof origin !== 'string' || specialCharaceterRegex.test(origin) || origin.trim().length < 3) {
        errors.push('A valid origin must be a string without special characters and must be at least 3 characters');
      }
    });
  }
  if (to && Array.isArray(to)) {
    to.forEach(destination => {
      if (typeof destination !== 'string' || specialCharaceterRegex.test(destination) || destination.trim().length < 3) {
        errors.push('A valid destination must be a string without special characters and must be at least 3 characters');
      }
    });
  }
  if (accommodation && Array.isArray(accommodation)) {
    accommodation.forEach(facility => {
      if ((typeof facility !== 'string' || specialCharaceterRegex.test(facility) || facility.trim().length < 5) && facility !== null) {
        errors.push('A valid accommodation must be a string without special characters and must be at least 5 characters long');
      }
    });
  }
  if (departureDate && Array.isArray(departureDate)) {
    departureDate.forEach(date => {
      if (typeof date !== 'string') {
        errors.push('Invalid date selected');
      }
    });
  }
  if (arrivalDate && Array.isArray(arrivalDate)) {
    arrivalDate.forEach(date => {
      if (typeof date !== 'string') {
        errors.push('Invalid date selected');
      }
    });
  }
  if (id && Array.isArray(id)) {
    id.forEach(tripId => {
      if (!Number.isInteger(tripId)) {
        errors.push('one of your trip IDs is not a valid integer');
      }
    });
  }
  if (type && !validtypes.includes(type)) errors.push('A valid request type is either \'one-way\', \'round-trip\', \'multi-city\'');
  if (reason && reason.trim().length <= 5) errors.push('reason cannot be less then 5 characters');
  if (passportName && passportName.trim().length <= 5) errors.push('passport name cannot be less then 5 characters');
  if (type && type === 'multi-city' && from && from.length < 2) errors.push('multi city request must contain more than one origin');
  if (type && type === 'multi-city' && to && to.length < 2) errors.push('multi city request must contain more than one destination');
  if (type && type === 'multi-city' && accommodation && accommodation.length < 2) errors.push('multi city request must contain more than one accomodation');
  if (type && type === 'multi-city' && departureDate && departureDate.length < 2) errors.push('multi city request must contain more than one departure date');
  if (type && type === 'multi-city' && arrivalDate) errors.push('irrelevant field \'arrivalDate\'');
  if (type && (type === 'one-way' || type === 'round-trip') && from && from.length > 1) errors.push('only one origin is allowed');
  if (type && (type === 'one-way' || type === 'round-trip') && to && to.length > 1) errors.push('only one destination is allowed');
  if (type && (type === 'one-way' || type === 'round-trip') && accommodation && accommodation.length > 1) errors.push('only one accommodation is allowed');
  if (type && (type === 'one-way' || type === 'round-trip') && departureDate && departureDate.length > 1) errors.push('only one departure date is allowed');
  if (type && (type === 'multi-city' || type === 'one-way') && arrivalDate) errors.push('irrelevant field \'arrivalDate\'');
  if (from && to && accommodation && departureDate) {
    if (from.length !== to.length || from.length !== accommodation.length || from.length !== departureDate.length) {
      errors.push('check that all travel information is complete');
    }
  }
  if (errors.length > 0) {
    return res.status(400).json({
      status: 400,
      error: errors
    });
  }
  return next();
};

export default validateEditRequest;
