import { Navigate, createBrowserRouter } from 'react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { AboutPage } from '@/pages/about/AboutPage'
import { ContactPage } from '@/pages/contact/ContactPage'
import { ErrorPage } from '@/pages/error/ErrorPage'
import { GalleryPage } from '@/pages/gallery/GalleryPage'
import { GroupPage } from '@/pages/groups/GroupPage'
import { GroupsPage } from '@/pages/groups/GroupsPage'
import { HomePage } from '@/pages/home/HomePage'
import { LeadersPage } from '@/pages/leaders/LeadersPage'
import { LivestreamPage } from '@/pages/livestream/LivestreamPage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { PrivacyPage } from '@/pages/privacy/PrivacyPage'
import { RecruitmentPage } from '@/pages/recruitment/RecruitmentPage'
import { RevuesPage } from '@/pages/revues/RevuesPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: { title: 'Forside' },
      },
      {
        path: 'om-oss',
        element: <AboutPage />,
        handle: { title: 'Om oss' },
      },
      {
        path: 'grupper',
        element: <GroupsPage />,
        handle: { title: 'Grupper' },
      },
      {
        path: 'grupper/:slug',
        element: <GroupPage />,
        handle: { title: 'Gruppe' },
      },
      {
        path: 'galleri',
        element: <GalleryPage />,
        handle: { title: 'Galleri' },
      },
      {
        path: 'revyer',
        element: <RevuesPage />,
        handle: { title: 'Tidligere revyer' },
      },
      {
        path: 'kontakt',
        element: <ContactPage />,
        handle: { title: 'Kontakt' },
      },
      {
        path: 'livestream',
        element: <LivestreamPage />,
        handle: { title: 'Livestream' },
      },
      {
        path: 'opptak',
        element: <RecruitmentPage />,
        handle: { title: 'Opptak' },
      },
      {
        path: 'personvern',
        element: <PrivacyPage />,
        handle: { title: 'Personvern' },
      },
      {
        path: 'ledere/:slug?',
        element: <LeadersPage />,
        handle: { title: 'Revyledelsen' },
      },
      {
        path: 'om_oss',
        element: <Navigate to="/om-oss" replace />,
      },
      {
        path: 'om_oss/:slug',
        element: <Navigate to="/om-oss" replace />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
