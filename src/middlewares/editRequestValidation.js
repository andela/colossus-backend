const validateEditRequest = (req, res, next) => {
  const {
    type, reason, passportName,
    managerId, from, to, arrivalDate,
    departureDate, accommodation, tripId
  } = req.body;

  const specialCharaceterRegex = /^(?=.*[!@#$%^.,&*])/;

  const errors = [];

  const validtypes = ['one-way', 'multi-city', 'round-trip'];

  if (from) {
    from.forEach(origin => {
      if (typeof origin !== 'string' || specialCharaceterRegex.test(origin)) {
        errors.push('A valid origin must be a string without special characters');
      }
    });
  }
  if (to) {
    to.forEach(destination => {
      if (typeof destination !== 'string' || specialCharaceterRegex.test(destination)) {
        errors.push('A valid destination must be a string without special characters');
      }
    });
  }
  if (accommodation) {
    accommodation.forEach(facility => {
      if (typeof facility !== 'string' || specialCharaceterRegex.test(facility) || facility.length < 5) {
        errors.push('A valid accommodation must be a string without special characters and must be at least 5 characters long');
      }
    });
  }
  if (departureDate) {
    departureDate.forEach(date => {
      if (typeof date !== 'string') {
        errors.push('Invalid date selected');
      }
    });
  }
  if (arrivalDate) {
    arrivalDate.forEach(date => {
      if (typeof date !== 'string') {
        errors.push('Invalid date selected');
      }
    });
  }
  if (tripId) {
    tripId.forEach(id => {
      if (!Number.isInteger(id)) {
        errors.push('one of your trip IDs is not a valid integer');
      }
    });
  }
  if (type && !validtypes.includes(type)) errors.push('A valid request type is either \'one-way\', \'round-trip\', \'multi-city\'');
  if (reason && reason.trim().length <= 5) errors.push('reason cannot be less then 5 characters');
  if (passportName && passportName.trim().length <= 5) errors.push('passport name cannot be less then 5 characters');
  if (managerId && !Number.isInteger(managerId)) errors.push('Manager id must be an integer');
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
  if (from && !Array.isArray(from)) errors.push('origin must be an array');
  if (to && !Array.isArray(to)) errors.push('destination must be an array');
  if (accommodation && !Array.isArray(accommodation)) errors.push('origin must be an array');
  if (accommodation && !Array.isArray(accommodation)) errors.push('accomodation must be an array');
  if (arrivalDate && !Array.isArray(arrivalDate)) errors.push('return date must be an array');
  if (departureDate && !Array.isArray(departureDate)) errors.push('travel date must be an array');
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      error: errors
    });
  }
  return next();
};

export default validateEditRequest;
