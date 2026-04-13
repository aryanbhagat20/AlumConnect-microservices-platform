import React from 'react'

const StudentSidebar = () => {
  return (
    <div className="w-64 bg-white border-r">
                <div className="p-4 border-b"><h2 className="text-xl font-bold">Student Portal</h2></div>
                <nav className="p-4 space-y-2">
                    <a href="/student/dashboard" className="block p-3 hover:bg-gray-100 rounded">Dashboard</a>
                    <a href="/student/profile" className="block p-3 hover:bg-gray-100 rounded">Profile</a>
                    <a href="/student/alumni-directory" className="block p-3 bg-blue-100 rounded">Alumni</a>
                    <a href="/student/jobs" className="block p-3 hover:bg-gray-100 rounded">Jobs</a>
                    <a href="/student/messages" className="block p-3 hover:bg-gray-100 rounded">Messages</a>
                    <a href="/student/applications" className="block p-3 hover:bg-gray-100 rounded">Applications</a>
                </nav>
            </div>
  )
}

export default StudentSidebar

