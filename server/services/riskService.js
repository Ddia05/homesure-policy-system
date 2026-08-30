/**
 * Calculate the risk score based on property features.
 */
const calculateRiskScore = (property) => {
  let score = 0;
  const currentYear = new Date().getFullYear();
  const propertyAge = currentYear - property.construction_year;

  // Property age rule
  if (propertyAge > 30) {
    score += 15;
  } else if (propertyAge >= 15) {
    score += 10;
  } else {
    score += 5;
  }

  // Security system rule
  if (!property.security_system) {
    score += 10;
  } else {
    score += 0;
  }

  // Construction type rule
  if (property.construction_type === 'WOOD') {
    score += 15;
  } else if (property.construction_type === 'MIXED') {
    score += 10;
  } else {
    // BRICK or CONCRETE
    score += 5;
  }

  // Property value rule
  if (Number(property.property_value) > 5000000) {
    score += 10;
  } else {
    score += 5;
  }

  return score;
};

/**
 * Determine risk level based on the risk score.
 */
const determineRiskLevel = (score) => {
  if (score <= 20) {
    return 'LOW';
  } else if (score <= 40) {
    return 'MEDIUM';
  } else {
    return 'HIGH';
  }
};

/**
 * Perform a full risk assessment.
 */
const assessRisk = (property) => {
  const riskScore = calculateRiskScore(property);
  const riskLevel = determineRiskLevel(riskScore);
  
  return {
    riskScore,
    riskLevel
  };
};

module.exports = {
  assessRisk,
  calculateRiskScore,
  determineRiskLevel
};
