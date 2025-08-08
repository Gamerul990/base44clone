import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/projects/projectsSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const ProjectsView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { projects } = useAppSelector((state) => state.projects)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View projects')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View projects')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/projects/projects-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>ProjectName</p>
                    <p>{projects?.name}</p>
                </div>

                <FormField label='Multi Text' hasTextareaHeight>
                  <textarea className={'w-full'} disabled value={projects?.description} />
                </FormField>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>User</p>

                        <p>{projects?.user?.firstName ?? 'No data'}</p>

                </div>

                <>
                    <p className={'block font-bold mb-2'}>Code_repositories Project</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>ClientFolder</th>

                                <th>ServerFolder</th>

                            </tr>
                            </thead>
                            <tbody>
                            {projects.code_repositories_project && Array.isArray(projects.code_repositories_project) &&
                              projects.code_repositories_project.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/code_repositories/code_repositories-view/?id=${item.id}`)}>

                                    <td data-label="client_folder">
                                        { item.client_folder }
                                    </td>

                                    <td data-label="server_folder">
                                        { item.server_folder }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!projects?.code_repositories_project?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/projects/projects-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

ProjectsView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default ProjectsView;
