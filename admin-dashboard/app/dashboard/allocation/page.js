export const metadata = {
  title: 'Allocation Engine | Allocation Admin',
};

export default function AllocationPage() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 120px)', border: 'none', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <iframe 
        src="/api/allocation-html" 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Smart Student Allocation System"
      />
    </div>
  );
}
