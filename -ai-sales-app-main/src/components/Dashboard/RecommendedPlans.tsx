import React from 'react';
import { Clock, Star, ArrowRight } from 'lucide-react';
import { LearningPlan } from '../../types';

interface RecommendedPlansProps {
  plans: LearningPlan[];
}

function getPlanTypeColor(type: 'strength' | 'improvement'): string {
  return type === 'strength' 
    ? 'bg-green-100 text-success-green border-green-200' 
    : 'bg-blue-100 text-sky-blue border-blue-200';
}

function getPlanTypeLabel(type: 'strength' | 'improvement'): string {
  return type === 'strength' ? '得意を伸ばす' : '課題を克服';
}

export default function RecommendedPlans({ plans }: RecommendedPlansProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPlanTypeColor(plan.type)}`}>
                  {getPlanTypeLabel(plan.type)}
                </span>
                {plan.type === 'strength' && (
                  <Star className="w-4 h-4 text-sunshine-yellow" />
                )}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-vivid-red transition-colors">
                {plan.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-vivid-red transition-colors" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{plan.estimatedDuration}分</span>
              </div>
              <span>{plan.scenarios.length}シナリオ</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {plan.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}