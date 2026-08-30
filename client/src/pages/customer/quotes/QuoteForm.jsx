import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { propertyService } from '../../../services/propertyService';
import { planService } from '../../../services/planService';
import { quoteService } from '../../../services/quoteService';
import { Check, ChevronRight } from 'lucide-react';

export default function QuoteForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Data
  const [properties, setProperties] = useState([]);
  const [plans, setPlans] = useState([]);
  
  // Selections
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [propsData, plansData] = await Promise.all([
        propertyService.getAll(),
        planService.getAll()
      ]);
      setProperties(propsData);
      setPlans(plansData);
    } catch (err) {
      setError('Failed to load required data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuote = async () => {
    try {
      setGenerating(true);
      setError(null);
      const quote = await quoteService.create({
        propertyId: selectedPropertyId,
        planId: selectedPlanId
      });
      navigate(`/customer/quotes/${quote.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate quote.');
      setGenerating(false);
    }
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  if (loading) return <div className="loading-state">Loading quote workflow...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Generate Quote</h1>
        <Link to="/customer/quotes" style={{ fontSize: '14px', fontWeight: '500' }}>Cancel</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
        {[
          { num: 1, label: 'Select Property' },
          { num: 2, label: 'Select Plan' },
          { num: 3, label: 'Review & Generate' }
        ].map((s, i) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', opacity: step >= s.num ? 1 : 0.5 }}>
            <div style={{ 
              width: '24px', height: '24px', borderRadius: '50%', 
              backgroundColor: step >= s.num ? 'var(--primary-navy)' : 'var(--bg-card)', 
              color: step >= s.num ? 'white' : 'var(--text-muted)',
              border: step >= s.num ? 'none' : '1px solid var(--border-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '12px', fontWeight: 'bold', marginRight: '8px' 
            }}>
              {step > s.num ? <Check size={14} /> : s.num}
            </div>
            <span style={{ fontSize: '14px', fontWeight: step >= s.num ? '600' : '400', color: step >= s.num ? 'var(--text-main)' : 'var(--text-muted)' }}>
              {s.label}
            </span>
            {i < 2 && <ChevronRight size={16} color="var(--text-muted)" style={{ margin: '0 16px' }} />}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '24px' }}>
        
        {/* STEP 1: Select Property */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--primary-navy)' }}>Which property would you like to insure?</h3>
            {properties.length === 0 ? (
              <div style={{ padding: '20px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                <p style={{ marginBottom: '16px' }}>You haven't added any properties yet.</p>
                <Link to="/customer/properties/new" className="btn-primary">Add a Property First</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {properties.map(property => (
                  <div 
                    key={property.id}
                    onClick={() => setSelectedPropertyId(property.id)}
                    style={{ 
                      padding: '16px', 
                      border: `2px solid ${selectedPropertyId === property.id ? 'var(--primary-navy)' : 'var(--border-light)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedPropertyId === property.id ? 'var(--bg-main)' : 'var(--bg-white)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <input 
                      type="radio" 
                      checked={selectedPropertyId === property.id} 
                      readOnly 
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>{property.address}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                        {property.property_type.replace(/_/g, ' ')} • Built {property.construction_year} • Value: ${parseFloat(property.property_value).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn-primary" 
                onClick={() => setStep(2)} 
                disabled={!selectedPropertyId}
              >
                Continue to Plans
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Plan */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--primary-navy)' }}>Select an Insurance Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {plans.map(plan => (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  style={{ 
                    padding: '20px', 
                    border: `2px solid ${selectedPlanId === plan.id ? 'var(--primary-navy)' : 'var(--border-light)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedPlanId === plan.id ? 'var(--bg-main)' : 'var(--bg-white)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{plan.name}</div>
                    <input 
                      type="radio" 
                      checked={selectedPlanId === plan.id} 
                      readOnly 
                      style={{ width: '18px', height: '18px' }}
                    />
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px', flex: 1 }}>{plan.description}</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-navy)', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                    Starts at ${parseFloat(plan.base_premium).toLocaleString()}/yr
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <strong>Includes:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '4px', marginBottom: 0 }}>
                      {plan.Coverages?.map(c => (
                        <li key={c.id}>{c.name} (Up to ${parseFloat(c.max_amount).toLocaleString()})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-primary" style={{ backgroundColor: 'var(--bg-white)', color: 'var(--text-main)', border: '1px solid var(--border-strong)' }} onClick={() => setStep(1)}>
                Back
              </button>
              <button 
                className="btn-primary" 
                onClick={() => setStep(3)} 
                disabled={!selectedPlanId}
              >
                Review Configuration
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review */}
        {step === 3 && selectedProperty && selectedPlan && (
          <div>
            <h3 style={{ marginBottom: '24px', color: 'var(--primary-navy)' }}>Review Quote Configuration</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Selected Property</div>
                <div style={{ fontWeight: '600', fontSize: '15px' }}>{selectedProperty.address}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                  {selectedProperty.property_type.replace(/_/g, ' ')}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                  Value: ${parseFloat(selectedProperty.property_value).toLocaleString()}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                  Built: {selectedProperty.construction_year} ({selectedProperty.construction_type})
                </div>
              </div>
              
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Selected Plan</div>
                <div style={{ fontWeight: '600', fontSize: '15px' }}>{selectedPlan.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                  {selectedPlan.description}
                </div>
                <div style={{ marginTop: '12px' }}>
                  <strong>Coverages Included:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px', marginBottom: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                    {selectedPlan.Coverages?.map(c => (
                      <li key={c.id}>{c.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f8fafe', border: '1px solid #dce4f5', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-main)' }}>
                By clicking Generate Quote, our underwriting engine will assess the property risk and calculate your final premium. This process is instant and requires no commitment.
              </p>
              <button 
                className="btn-primary" 
                style={{ padding: '12px 24px', fontSize: '16px' }}
                onClick={handleGenerateQuote} 
                disabled={generating}
              >
                {generating ? 'Calculating Risk & Premium...' : 'Generate Quote Now'}
              </button>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <button className="btn-primary" style={{ backgroundColor: 'var(--bg-white)', color: 'var(--text-main)', border: '1px solid var(--border-strong)' }} onClick={() => setStep(2)}>
                Back
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
