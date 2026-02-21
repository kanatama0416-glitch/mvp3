import React, { useState } from 'react';
import Diagnosis from '../Diagnosis/Diagnosis';
import EvaluationResults from './EvaluationResults';

export default function Evaluation() {
  const [currentView, setCurrentView] = useState<'diagnosis' | 'results'>('diagnosis');
  const [evaluationData, setEvaluationData] = useState<any>(null);

  const handleDiagnosisComplete = (data: any) => {
    // 診断完了後は結果画面へ遷移（履歴は保存しない）
    setEvaluationData(data);
    setCurrentView('results');
  };

  const handleRetakeDiagnosis = () => {
    setCurrentView('diagnosis');
    setEvaluationData(null);
  };

  return (
    <div className="min-h-0">
      {currentView === 'diagnosis' ? (
        <Diagnosis onComplete={handleDiagnosisComplete} />
      ) : (
        <EvaluationResults
          evaluationData={evaluationData}
          onRetakeDiagnosis={handleRetakeDiagnosis}
        />
      )}
    </div>
  );
}

