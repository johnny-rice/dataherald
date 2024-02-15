import PageLayout from '@/components/layout/page-layout'
import EditOrganizationDialog from '@/components/organization/edit-organization-dialog'
import { Button } from '@/components/ui/button'
import { ContentBox } from '@/components/ui/content-box'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import UserList from '@/components/user/user-list'
import { useAppContext } from '@/contexts/app-context'
import { copyToClipboard } from '@/lib/utils'
import { ERole } from '@/models/api'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import { ArrowLeftRight, Building2, Copy, UsersRound } from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'
import { FC, ReactNode } from 'react'

type OrganizationDisplayDetails = {
  label: string
  description: string
  value: string
  action: JSX.Element
}

const OrganizationSettingsPage: FC = () => {
  const { user, organization } = useAppContext()

  if (!organization) return null

  const isAdmin = user?.role === ERole.ADMIN

  const handleCopyOrgId = async () => {
    try {
      await copyToClipboard(organization.id)
      toast({
        variant: 'success',
        title: 'Organization ID copied!',
      })
    } catch (error) {
      console.error('Could not copy text: ', error)
      toast({
        variant: 'destructive',
        title: 'Could not copy the Organization ID',
      })
    }
  }

  const ORGANIZATION_DETAILS_DISPLAY: OrganizationDisplayDetails[] = [
    {
      label: 'Organization name',
      description: 'Human-friendly label to display in user interfaces',
      value: organization.name,
      action: <EditOrganizationDialog />,
    },
    {
      label: 'Organization ID',
      description: 'Identifier for this organization used in API requests',
      value: organization.id,
      action: (
        <Button variant="icon" onClick={handleCopyOrgId}>
          <Copy size={20} />
        </Button>
      ),
    },
  ]

  const renderDetails: (details: OrganizationDisplayDetails[]) => ReactNode = (
    details,
  ) =>
    details.map(({ label, description, value, action }, index) => (
      <div key={index} className="flex flex-col gap-1">
        <div className="flex flex-col">
          <strong>{label}</strong>
          <p className="text-slate-500 text-sm">{description}</p>
        </div>
        <div className="flex items-center gap-1">
          <Input
            className="w-2/3 border border-slate-300 focus-visible:ring-0"
            readOnly
            value={value}
          />
          {action}
        </div>
      </div>
    ))

  return (
    <PageLayout>
      <Head>
        <title>Organization - Dataherald AI API</title>
      </Head>
      <div className="grow flex flex-col gap-5 m-6">
        {isAdmin && (
          <Link className="w-fit" href="/change-organization">
            <Button>
              <ArrowLeftRight className="mr-2" size={16} />
              Change Organization
            </Button>
          </Link>
        )}
        <ContentBox className="grow-0 max-w-2xl">
          <div className="flex items-start gap-2">
            <Building2 size={20} strokeWidth={2.5} />
            <h1 className="font-semibold">Details</h1>
          </div>
          <div className="flex flex-col gap-4 pt-3">
            {renderDetails(ORGANIZATION_DETAILS_DISPLAY)}
          </div>
        </ContentBox>
        <ContentBox className="grow max-w-2xl">
          <div className="flex items-start gap-2">
            <UsersRound size={20} strokeWidth={2.5} />
            <h1 className="font-semibold">Team</h1>
          </div>
          <UserList />
        </ContentBox>
      </div>
    </PageLayout>
  )
}

export default withPageAuthRequired(OrganizationSettingsPage)
