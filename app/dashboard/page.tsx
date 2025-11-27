import React, { useState, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Home, TrendingUp, DollarSign, Target, Settings, Plus, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_TRANSACTIONS = [
  { id: 1, date: '2024-11-20', description: 'Groceries (Trader Joe\'s)', amount: 125.50, category: 'Food' },
  { id: 2, date: '2024-11-19', description: 'Monthly Gym Membership', amount: 49.99, category: 'Subscriptions' },
  { id: 3, date: '2024-11-17', description: 'Dinner Out (Italian)', amount: 78.00, category: 'Leisure' },
  { id: 4, date: '2024-11-15', description: 'Rent Payment', amount: 1500.00, category: 'Housing' },
  { id: 5, date: '2024-11-14', description: 'Online Course Subscription', amount: 19.99, category: 'Subscriptions' },
];

const MOCK_EXPENSE_DATA = [
  { week: 'Wk 1', actual: 1850, budgeted: 2000 },
  { week: 'Wk 2', actual: 450, budgeted: 500 },
  { week: 'Wk 3', actual: 720, budgeted: 600 }, // Over budget here
  { week: 'Wk 4', actual: 480, budgeted: 500 },
];

const MOCK_GOALS = [
  {
    id: 1,
    name: 'New Laptop (High-end)',
    targetDate: '2025-05-01',
    targetAmount: 2500,
    saved: 850,
    requiredMonthlySaving: 282,
    isFeasible: true,
  },
  {
    id: 2,
    name: 'Trip to Japan',
    targetDate: '2025-08-15',
    targetAmount: 4000,
    saved: 50,
    requiredMonthlySaving: 493,
    isFeasible: false, // Too ambitious based on mock current savings rate
  }
];

// --- UTILITY COMPONENTS ---

const Card = ({ title, value, icon, className = '' }) => (
  <div className={`p-5 bg-white rounded-xl shadow-lg flex items-center justify-between transition duration-300 hover:shadow-xl ${className}`}>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
      {icon}
    </div>
  </div>
);

const FeasibilityIndicator = ({ isFeasible }) => (
  <div className={`flex items-center text-sm font-semibold p-2 rounded-lg ${isFeasible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
    {isFeasible ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertTriangle className="w-4 h-4 mr-1" />}
    {isFeasible ? 'On Track' : 'Needs Adjustment'}
  </div>
);

// --- VIEW COMPONENTS ---

const GoalAnalysis = ({ goal }) => {
  const progress = (goal.saved / goal.targetAmount) * 100;
  const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
  const monthsLeft = (daysLeft / 30).toFixed(1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{goal.name}</h3>
        <FeasibilityIndicator isFeasible={goal.isFeasible} />
      </div>

      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <div>
          <Calendar className="w-4 h-4 inline mr-1 text-indigo-500" /> Target Date: <span className="font-medium text-gray-700">{goal.targetDate}</span>
        </div>
        <div>
          <Clock className="w-4 h-4 inline mr-1 text-indigo-500" /> Months Left: <span className="font-medium text-gray-700">{monthsLeft}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
          <span>Progress: ${goal.saved.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${goal.isFeasible ? 'bg-green-500' : 'bg-yellow-500'}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <p className="text-sm">
          <span className="font-bold text-indigo-600">${goal.requiredMonthlySaving.toFixed(2)}</span>{' '}
          <span className="text-gray-500">required to save monthly.</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-500">Analysis: Based on your current monthly average expenses (~$2500), this goal is{' '}</span>
          <span className={`font-bold ${goal.isFeasible ? 'text-green-600' : 'text-red-600'}`}>
            {goal.isFeasible ? 'achievable' : 'not feasible'}
          </span>
          <span className="text-gray-500"> without cutting ${Math.abs(282 - 493).toFixed(2)} in monthly expenses.</span>
        </p>
      </div>
    </div>
  );
};

const GoalsView = () => (
  <div className="p-6">
    <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Savings Goals & Feasibility</h2>
    
    <button className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-150 mb-8">
      <Plus className="w-5 h-5 mr-2" /> Add New Goal
    </button>
    
    <div className="space-y-6">
      {MOCK_GOALS.map(goal => (
        <GoalAnalysis key={goal.id} goal={goal} />
      ))}
    </div>
  </div>
);

const ExpenseChartView = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Expense vs. Budget (Weekly Breakdown)</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={MOCK_EXPENSE_DATA}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="week" />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
        <Legend />
        <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual Expense" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="budgeted" stroke="#82ca9d" name="Budget Limit" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
    <p className="text-sm text-gray-500 mt-4 text-center">
      Analysis shows Week 3 expenses exceeded the set budget.
    </p>
  </div>
);

const TransactionList = ({ transactions }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
    <div className="space-y-3">
      {transactions.map(t => (
        <div key={t.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
          <div>
            <p className="font-medium text-gray-700">{t.description}</p>
            <p className="text-xs text-gray-500">{t.date} | {t.category}</p>
          </div>
          <p className={`font-semibold text-lg ${t.amount > 100 ? 'text-red-500' : 'text-green-500'}`}>
            -${t.amount.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const DashboardView = () => {
  const totalExpense = MOCK_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0).toFixed(2);
  const weeklyAverage = (totalExpense / 4).toFixed(2); // Mocking 4 weeks

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-extrabold text-gray-900">Monthly Budget Summary (Nov 2024)</h2>
      
      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          title="Total Monthly Expense"
          value={`$${totalExpense}`}
          icon={<DollarSign className="w-6 h-6" />}
          className="bg-red-50"
        />
        <Card
          title="Weekly Average Expense"
          value={`$${weeklyAverage}`}
          icon={<Clock className="w-6 h-6" />}
          className="bg-blue-50"
        />
        <Card
          title="Goal Progress"
          value="3 Goals Active"
          icon={<Target className="w-6 h-6" />}
          className="bg-indigo-50"
        />
      </div>

      {/* Charts and Transactions */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ExpenseChartView />
        </div>
        <div className="lg:col-span-1">
          <TransactionList transactions={MOCK_TRANSACTIONS.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'goals', name: 'Goals Analysis', icon: Target },
    { id: 'expenses', name: 'Add Expense', icon: Plus },
    { id: 'reports', name: 'Reports', icon: TrendingUp },
  ];

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'goals':
        return <GoalsView />;
      case 'expenses':
        // A simple form for adding expenses
        return (
          <div className="p-6">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Record New Transaction</h2>
            <div className="max-w-xl bg-white p-8 rounded-xl shadow-lg space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($)</label>
                <input
                  type="number"
                  id="amount"
                  placeholder="e.g. 55.99"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  id="description"
                  placeholder="e.g. Coffee shop"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="category"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-white"
                >
                  <option>Food</option>
                  <option>Housing</option>
                  <option>Subscriptions</option>
                  <option>Transport</option>
                  <option>Leisure</option>
                </select>
              </div>
              <button className="w-full bg-green-600 text-white px-4 py-3 rounded-xl shadow-md hover:bg-green-700 transition duration-150 font-semibold">
                Save Expense
              </button>
            </div>
          </div>
        );
      case 'reports':
        return (
             <div className="p-6">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Category Spending Report</h2>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Spending by Category (Mock)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={[{ name: 'Food', amount: 450 }, { name: 'Housing', amount: 1500 }, { name: 'Subscriptions', amount: 70 }, { name: 'Leisure', amount: 150 }]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `$${value}`} />
                            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Spending']} />
                            <Legend />
                            <Bar dataKey="amount" fill="#f97316" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
      default:
        return <DashboardView />;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 flex antialiased">
      {/* Sidebar Navigation (Hidden on small screens) */}
      <div className="hidden lg:flex flex-col w-64 bg-white shadow-xl">
        <div className="flex items-center justify-center h-20 border-b">
          <DollarSign className="w-8 h-8 text-indigo-600 mr-2" />
          <span className="text-2xl font-extrabold text-gray-900">Auto Budget</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-base font-medium transition duration-150 ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t text-sm text-gray-500">
            <Settings className="w-4 h-4 inline mr-1" /> Settings & Profile
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar for Mobile */}
        <header className="lg:hidden bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="w-6 h-6 text-indigo-600 mr-2" />
            <span className="text-xl font-bold">Auto Budget</span>
          </div>
        </header>
        
        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
          <nav className="flex justify-around p-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center p-2 text-xs font-medium rounded-lg transition duration-150 ${
                  activeTab === item.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dynamic Content Rendering */}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
